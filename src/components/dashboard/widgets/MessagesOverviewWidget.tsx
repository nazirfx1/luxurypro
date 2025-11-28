import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MessagesOverviewWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:sender_id(full_name), recipient:recipient_id(full_name)")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    loadMessages();
  }, [user]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer" onClick={() => navigate("/dashboard/messages")}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {msg.sender_id === user?.id ? `To: ${msg.recipient?.full_name}` : `From: ${msg.sender?.full_name}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">{msg.subject || "No subject"}</p>
              </div>
              {!msg.read && msg.recipient_id === user?.id && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
          )}
          <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/dashboard/messages")}>
            View All Messages
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
