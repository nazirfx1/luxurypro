import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ClientsOverviewWidget = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      const { data, error } = await supabase.from("clients").select("status");

      if (!error && data) {
        setStats({
          total: data.length,
          active: data.filter(c => c.status === "active").length,
          new: data.filter(c => c.status === "new").length,
        });
      }
      setLoading(false);
    };

    loadClients();
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
        <CardTitle className="text-sm font-medium">Clients</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600 font-medium">{stats.active}</span> active • <span className="text-blue-600 font-medium">{stats.new}</span> new
        </p>
      </CardContent>
    </Card>
  );
};
