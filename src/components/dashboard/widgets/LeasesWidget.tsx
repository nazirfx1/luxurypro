import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LeasesWidget = () => {
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeases = async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("end_date, status");

      if (!error && data) {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        setStats({
          total: data.filter((l) => l.status === "active").length,
          expiringSoon: data.filter(
            (l) =>
              l.status === "active" &&
              new Date(l.end_date) <= thirtyDaysLater &&
              new Date(l.end_date) >= now
          ).length,
        });
      }
      setLoading(false);
    };

    loadLeases();

    const channel = supabase
      .channel("leases-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "leases" }, loadLeases)
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
        <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mt-1">Current agreements</p>
        {stats.expiringSoon > 0 && (
          <div className="flex items-center text-xs text-orange-600 mt-2">
            <AlertCircle className="w-3 h-3 mr-1" />
            {stats.expiringSoon} expiring soon
          </div>
        )}
      </CardContent>
    </Card>
  );
};
