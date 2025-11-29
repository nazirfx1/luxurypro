import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyOccupancyWidget = () => {
  const [occupancy, setOccupancy] = useState({ total: 0, occupied: 0, rate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOccupancy = async () => {
      const [properties, leases] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("leases").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const total = properties.count || 0;
      const occupied = leases.count || 0;
      const rate = total > 0 ? (occupied / total) * 100 : 0;

      setOccupancy({ total, occupied, rate });
      setLoading(false);
    };

    loadOccupancy();

    // Real-time subscriptions for both properties and leases
    const channel = supabase
      .channel("property-occupancy-widget")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        loadOccupancy
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leases" },
        loadOccupancy
      )
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
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Property Occupancy</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Occupied</span>
            <span className="font-medium">{occupancy.occupied} / {occupancy.total}</span>
          </div>
          <Progress value={occupancy.rate} className="h-2" />
          <div className="text-2xl font-bold">{occupancy.rate.toFixed(0)}%</div>
        </div>
      </CardContent>
    </Card>
  );
};
