import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MaintenanceWidget = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaintenance = async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("status, priority");

      if (!error && data) {
        setStats({
          total: data.length,
          pending: data.filter((m) => m.status === "pending").length,
          urgent: data.filter((m) => m.priority === "urgent").length,
        });
      }
      setLoading(false);
    };

    loadMaintenance();

    const channel = supabase
      .channel("maintenance-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "maintenance_requests" }, loadMaintenance)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
        <Wrench className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-yellow-600 font-medium">{stats.pending}</span> pending
        </p>
        {stats.urgent > 0 && (
          <div className="flex items-center text-xs text-red-600 mt-2">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {stats.urgent} urgent
          </div>
        )}
      </CardContent>
    </Card>
  );
};
