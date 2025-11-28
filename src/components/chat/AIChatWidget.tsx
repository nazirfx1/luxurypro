import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you in English or Somali. How can I assist you today?\n\nNabad! Waxaan kaa caawin karaa Ingiriisiga ama Soomaliga. Sidee kugu caawin karaa maanta?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantMessage = '';
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantMessage += parsed.content;
              setMessages([...newMessages, { 
                id: 'assistant-' + Date.now(), 
                role: 'assistant', 
                content: assistantMessage,
                timestamp: new Date()
              }]);
            }
          } catch (e) {
            // Ignore parse errors for incomplete JSON
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        id: 'error-' + Date.now(),
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.\n\nWaan ka xumahay, cilad ayaa dhacday. Fadlan mar kale isku day.',
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    streamChat(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 h-14 w-14 rounded-full shadow-elegant bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black z-50 transition-smooth active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bg-brand-black border border-brand-yellow/20 shadow-yellow z-50 transition-all",
        isFullScreen
          ? "inset-0 md:inset-4 rounded-none md:rounded-lg"
          : "bottom-0 md:bottom-6 left-0 md:left-auto right-0 md:right-6 w-full md:w-96 h-[100dvh] md:h-[600px] rounded-t-2xl md:rounded-lg"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-4 border-b border-brand-yellow/20 bg-brand-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-brand-black" />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-brand-black"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Support</h3>
            <p className="text-xs text-brand-yellow">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="hidden md:flex h-9 w-9 text-white hover:bg-brand-yellow/10 hover:text-brand-yellow transition-smooth"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-9 w-9 text-white hover:bg-brand-yellow/10 hover:text-brand-yellow transition-smooth active:scale-95"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 md:p-4" style={{ height: 'calc(100% - 140px)' }} ref={scrollRef}>
        <div className="space-y-3 md:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex animate-fade-in-up",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base whitespace-pre-wrap shadow-card transition-smooth",
                  message.role === 'user'
                    ? 'bg-brand-yellow text-brand-black rounded-br-md'
                    : 'bg-brand-black-light text-white border border-brand-yellow/20 rounded-bl-md'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-brand-black-light text-white border border-brand-yellow/20 rounded-2xl rounded-bl-md px-5 py-3 text-sm">
                <div className="flex gap-1.5">
                  <span className="animate-bounce text-brand-yellow" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce text-brand-yellow" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce text-brand-yellow" style={{ animationDelay: '300ms' }}>●</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-brand-yellow/20 bg-brand-black sticky bottom-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] md:min-h-[40px] max-h-[120px] resize-none bg-brand-black-light border-brand-yellow/20 text-white placeholder:text-white/50 focus:border-brand-yellow rounded-2xl text-base md:text-sm transition-smooth"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 md:h-10 md:w-10 flex-shrink-0 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black rounded-full transition-smooth active:scale-95 shadow-yellow disabled:opacity-50"
          >
            <Send className="h-5 w-5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
