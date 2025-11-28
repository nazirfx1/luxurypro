import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const PendingTasksWidget = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { count } = await supabase.from("maintenance_requests").select("*", { count: "exact", head: true }).eq("assigned_to", user.id).eq("status", "pending");
      setCount(count || 0);
    };
    load();
  }, [user]);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Pending</CardTitle>
        <Clock className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">{count}</div>
      </CardContent>
    </Card>
  );
};
