import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MyMaintenanceWidget = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadMaintenance = async () => {
      const { data: properties } = await supabase
        .from("properties")
        .select("id")
        .eq("created_by", user.id);

      if (!properties) return;

      const propertyIds = properties.map(p => p.id);
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("status")
        .in("property_id", propertyIds);

      if (!error && data) {
        setStats({
          total: data.length,
          pending: data.filter(m => m.status === "pending").length,
        });
      }
      setLoading(false);
    };

    loadMaintenance();
  }, [user]);

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
        <div className="text-2xl font-bold">{stats.pending}</div>
        <p className="text-xs text-muted-foreground mt-1">Pending • {stats.total} total</p>
      </CardContent>
    </Card>
  );
};
