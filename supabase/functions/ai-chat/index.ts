import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a bilingual (Somali & English) real estate AI assistant for a property management platform. 

Your capabilities:
- Answer questions in Somali or English (detect language automatically)
- Help users navigate: signup, booking visits, listing properties, payments
- Access real-time property data: availability, pricing, locations
- Guide step-by-step processes: registration, document upload, bookings
- Provide smart recommendations based on user needs

When users ask about properties, use the get_properties tool to fetch current data.
When users ask about cities/locations, use the get_cities tool.
When users ask about bookings/visits, use the get_visits tool.

Be helpful, friendly, and concise. Always respond in the same language the user uses.

Example interactions:
- "Show me 3-bedroom apartments under $300/month" → Use get_properties with filters
- "Which properties are in Mogadishu?" → Use get_properties filtered by city
- "Ma jiraan guryaha cusub?" (Are there new properties?) → Respond in Somali, use get_properties

Keep responses conversational and helpful.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Tools for database access
    const tools = [
      {
        type: "function",
        function: {
          name: "get_properties",
          description: "Search and filter properties from the database. Returns available properties with details.",
          parameters: {
            type: "object",
            properties: {
              property_type: { 
                type: "string",
                description: "Filter by property type (e.g., apartment, villa, house)"
              },
              city: { 
                type: "string",
                description: "Filter by city/location"
              },
              max_price: { 
                type: "number",
                description: "Maximum price filter"
              },
              bedrooms: { 
                type: "number",
                description: "Number of bedrooms"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return",
                default: 5
              }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_cities",
          description: "Get list of available cities/locations in the system",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      }
    ];

    console.log('Processing chat request with', messages.length, 'messages');

    // Store or update conversation
    const { data: existingConv } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    let conversationId = existingConv?.id;

    if (!conversationId) {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({
          session_id: sessionId,
          user_id: userId || null,
          language: messages[0]?.content?.toLowerCase().includes('somali') ? 'so' : 'en',
        })
        .select('id')
        .single();
      conversationId = newConv?.id;
    } else {
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
    }

    // Store user message
    const userMessage = messages[messages.length - 1];
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: userMessage.role,
        content: userMessage.content,
      });

    let assistantResponse = '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service unavailable. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    // Handle streaming with tool calls
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        let buffer = "";
        let toolCalls: any[] = [];
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim() || line.startsWith(":")) continue;
              if (!line.startsWith("data: ")) continue;
              
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const choice = parsed.choices?.[0];
                
                if (choice?.delta?.tool_calls) {
                  for (const tc of choice.delta.tool_calls) {
                    if (!toolCalls[tc.index]) {
                      toolCalls[tc.index] = { id: tc.id, function: { name: tc.function?.name || "", arguments: "" } };
                    }
                    if (tc.function?.arguments) {
                      toolCalls[tc.index].function.arguments += tc.function.arguments;
                    }
                  }
                }

                if (choice?.delta?.content) {
                  const content = choice.delta.content;
                  assistantResponse += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }

                if (choice?.finish_reason === "tool_calls" && toolCalls.length > 0) {
                  // Execute tool calls
                  for (const toolCall of toolCalls) {
                    const args = JSON.parse(toolCall.function.arguments);
                    let result = null;

                    if (toolCall.function.name === "get_properties") {
                      let query = supabase
                        .from('properties')
                        .select('id, title, price, bedrooms, bathrooms, city, property_type, address, description')
                        .eq('status', 'active')
                        .limit(args.limit || 5);

                      if (args.property_type) query = query.eq('property_type', args.property_type);
                      if (args.city) query = query.ilike('city', `%${args.city}%`);
                      if (args.max_price) query = query.lte('price', args.max_price);
                      if (args.bedrooms) query = query.eq('bedrooms', args.bedrooms);

                      const { data } = await query;
                      result = data || [];
                    } else if (toolCall.function.name === "get_cities") {
                      const { data } = await supabase
                        .from('cities')
                        .select('name, country')
                        .limit(20);
                      result = data || [];
                    }

                    // Send tool result back to AI
                    const toolResultResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${LOVABLE_API_KEY}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        model: "google/gemini-2.5-flash",
                        messages: [
                          { role: "system", content: SYSTEM_PROMPT },
                          ...messages,
                          {
                            role: "assistant",
                            tool_calls: [{
                              id: toolCall.id,
                              type: "function",
                              function: {
                                name: toolCall.function.name,
                                arguments: toolCall.function.arguments
                              }
                            }]
                          },
                          {
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(result)
                          }
                        ],
                        stream: true,
                      }),
                    });

                    // Stream the response with tool results
                    const toolReader = toolResultResponse.body?.getReader();
                    if (toolReader) {
                      let toolBuffer = "";
                      while (true) {
                        const { done: toolDone, value: toolValue } = await toolReader.read();
                        if (toolDone) break;

                        toolBuffer += new TextDecoder().decode(toolValue);
                        const toolLines = toolBuffer.split("\n");
                        toolBuffer = toolLines.pop() || "";

                        for (const toolLine of toolLines) {
                          if (!toolLine.trim() || toolLine.startsWith(":")) continue;
                          if (!toolLine.startsWith("data: ")) continue;
                          
                          const toolData = toolLine.slice(6);
                          if (toolData === "[DONE]") continue;

                          try {
                            const toolParsed = JSON.parse(toolData);
                            const toolChoice = toolParsed.choices?.[0];
                            
                            if (toolChoice?.delta?.content) {
                              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: toolChoice.delta.content })}\n\n`));
                            }
                          } catch (e) {
                            console.error("Tool parse error:", e);
                          }
                        }
                      }
                    }
                  }
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();

          // Store assistant response
          if (assistantResponse && conversationId) {
            await supabase
              .from('chat_messages')
              .insert({
                conversation_id: conversationId,
                role: 'assistant',
                content: assistantResponse,
              });
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
