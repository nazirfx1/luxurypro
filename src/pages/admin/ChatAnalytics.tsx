import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  Search,
  Calendar,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Conversation {
  id: string;
  session_id: string;
  language: string;
  started_at: string;
  last_message_at: string;
  satisfaction_rating: number | null;
  feedback: string | null;
  resolved: boolean;
  user_id: string | null;
}

interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface Analytics {
  totalConversations: number;
  averageSatisfaction: number;
  resolvedRate: number;
  languageBreakdown: { language: string; count: number }[];
  commonQuestions: { question: string; count: number }[];
}

const ChatAnalytics = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalConversations: 0,
    averageSatisfaction: 0,
    resolvedRate: 0,
    languageBreakdown: [],
    commonQuestions: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    fetchAnalytics();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          fetchConversations();
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: convData } = await supabase
        .from('chat_conversations')
        .select('*');

      if (convData) {
        const total = convData.length;
        const withRating = convData.filter(c => c.satisfaction_rating);
        const avgSatisfaction = withRating.length > 0
          ? withRating.reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) / withRating.length
          : 0;
        const resolved = convData.filter(c => c.resolved).length;

        const langBreakdown = convData.reduce((acc, c) => {
          const lang = c.language || 'en';
          const existing = acc.find(l => l.language === lang);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ language: lang, count: 1 });
          }
          return acc;
        }, [] as { language: string; count: number }[]);

        // Fetch messages for common questions analysis
        const { data: msgData } = await supabase
          .from('chat_messages')
          .select('content, role')
          .eq('role', 'user')
          .limit(1000);

        const questionMap = new Map<string, number>();
        msgData?.forEach(msg => {
          const key = msg.content.toLowerCase().slice(0, 50);
          questionMap.set(key, (questionMap.get(key) || 0) + 1);
        });

        const commonQuestions = Array.from(questionMap.entries())
          .map(([question, count]) => ({ question, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setAnalytics({
          totalConversations: total,
          averageSatisfaction: avgSatisfaction,
          resolvedRate: total > 0 ? (resolved / total) * 100 : 0,
          languageBreakdown: langBreakdown,
          commonQuestions,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const query = searchQuery.toLowerCase();
    return conv.session_id.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Chat Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor conversations, analyze trends, and track satisfaction
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalConversations}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageSatisfaction.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">User ratings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.resolvedRate.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Issues resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversations.filter(c => c.user_id).length}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversation List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                  <CardDescription>{filteredConversations.length} conversations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-6 pt-0">
                      {filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedConversation === conv.id
                              ? 'bg-accent border-primary'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {conv.user_id ? 'Registered User' : 'Guest User'}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {conv.session_id}
                              </p>
                            </div>
                            <Badge variant={conv.language === 'so' ? 'default' : 'secondary'}>
                              {conv.language === 'so' ? 'SO' : 'EN'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conv.last_message_at), 'PPp')}
                            </span>
                          </div>
                          {conv.satisfaction_rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {Array.from({ length: conv.satisfaction_rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Message View */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    {selectedConversation ? 'Conversation details' : 'Select a conversation'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedConversation ? (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-4 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs mt-2 opacity-70">
                                {format(new Date(msg.created_at), 'p')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                      Select a conversation to view messages
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Language Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.languageBreakdown.map((lang) => (
                      <div key={lang.language}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {lang.language === 'so' ? 'Somali' : 'English'}
                          </span>
                          <span className="text-sm text-muted-foreground">{lang.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(lang.count / analytics.totalConversations) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Most Common Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {analytics.commonQuestions.map((q, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium truncate">{q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Asked {q.count} times
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ChatAnalytics;
