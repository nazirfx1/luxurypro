import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { Card as ChartCard } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read: boolean;
  subject: string | null;
  sender: {
    full_name: string;
    email: string;
  };
  recipient: {
    full_name: string;
    email: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessages();
      
      // Real-time subscription
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          },
          (payload) => {
            toast.info("New message received");
            loadMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, email),
          recipient:profiles!messages_recipient_id_fkey(full_name, email)
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user?.id,
          recipient_id: selectedConversation,
          content: newMessage,
          subject: null,
        });

      if (error) throw error;
      setNewMessage("");
      loadMessages();
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Group messages by conversation partner
  const conversations = messages.reduce((acc, msg) => {
    const partnerId = msg.sender_id === user?.id ? msg.recipient_id : msg.sender_id;
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partner: msg.sender_id === user?.id ? msg.recipient : msg.sender,
        messages: [],
        unreadCount: 0,
      };
    }
    acc[partnerId].messages.push(msg);
    if (msg.recipient_id === user?.id && !msg.read) {
      acc[partnerId].unreadCount++;
    }
    return acc;
  }, {} as Record<string, any>);

  const conversationList = Object.entries(conversations);
  const currentConversation = selectedConversation ? conversations[selectedConversation] : null;

  // Analytics
  const totalUnread = conversationList.reduce((sum, [, conv]) => sum + conv.unreadCount, 0);
  const dailyMessages = messages.reduce((acc: any, msg) => {
    const day = format(new Date(msg.created_at), "MMM dd");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const messageChartData = Object.entries(dailyMessages).slice(-7).map(([day, count]) => ({ day, count }));

  return (
    <DashboardLayout>
      <PageHeader 
        title="Messages" 
        description="Communicate with property managers and support"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Messages" }
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
            <ExportMenu data={messages} filename="messages" />
          </div>
        }
      />

      {/* Analytics */}
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ChartCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Messages</h3>
            <p className="text-3xl font-bold text-primary">{messages.length}</p>
            <p className="text-sm text-muted-foreground mt-1">All conversations</p>
          </ChartCard>
          <ChartCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Unread Messages</h3>
            <p className="text-3xl font-bold text-orange-600">{totalUnread}</p>
            <p className="text-sm text-muted-foreground mt-1">Needs attention</p>
          </ChartCard>
          <ChartCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Conversations</h3>
            <p className="text-3xl font-bold text-blue-600">{conversationList.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Open threads</p>
          </ChartCard>
          <ChartCard className="p-6 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Message Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={messageChartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <Card className="flex h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-73px)]">
            <div className="p-2">
              {conversationList.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No conversations yet</p>
              ) : (
                conversationList.map(([partnerId, conv]) => (
                  <div
                    key={partnerId}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                      selectedConversation === partnerId ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(partnerId)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {conv.partner.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold truncate">{conv.partner.full_name}</p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">{conv.unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.messages[0].content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(conv.messages[0].created_at), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {currentConversation?.partner.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{currentConversation?.partner.full_name}</p>
                    <p className="text-sm text-muted-foreground">{currentConversation?.partner.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentConversation?.messages.reverse().map((msg: Message) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {format(new Date(msg.created_at), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={2}
                    className="resize-none"
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Messages;
