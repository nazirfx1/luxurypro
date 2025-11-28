import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyStatsWidget = () => {
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("status", { count: "exact" });

      if (!error && data) {
        setStats({
          total: data.length,
          active: data.filter((p) => p.status === "active").length,
        });
      }
      setLoading(false);
    };

    loadStats();

    const channel = supabase
      .channel("properties-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "properties" }, loadStats)
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
        <CardTitle className="text-sm font-medium">Properties</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600 font-medium">{stats.active}</span> active listings
        </p>
        <div className="flex items-center text-xs text-green-600 mt-2">
          <TrendingUp className="w-3 h-3 mr-1" />
          {stats.active > 0 ? `${((stats.active / stats.total) * 100).toFixed(0)}%` : "0%"} active
        </div>
      </CardContent>
    </Card>
  );
};
