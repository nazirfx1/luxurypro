import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const SystemStatsWidget = () => {
  const [stats, setStats] = useState({ properties: 0, users: 0, leases: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [properties, users, leases, clients] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("leases").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        properties: properties.count || 0,
        users: users.count || 0,
        leases: leases.count || 0,
        clients: clients.count || 0,
      });
      setLoading(false);
    };

    loadStats();
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
        <CardTitle className="text-sm font-medium">System Stats</CardTitle>
        <Database className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Properties:</span>
            <span className="font-semibold">{stats.properties}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Users:</span>
            <span className="font-semibold">{stats.users}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Leases:</span>
            <span className="font-semibold">{stats.leases}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Clients:</span>
            <span className="font-semibold">{stats.clients}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
