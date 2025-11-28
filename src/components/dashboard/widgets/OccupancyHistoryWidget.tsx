import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const OccupancyHistoryWidget = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      const { data: properties } = await supabase
        .from("properties")
        .select("id")
        .eq("created_by", user.id);

      if (!properties) return;

      const propertyIds = properties.map(p => p.id);
      const { data, error } = await supabase
        .from("leases")
        .select("start_date, end_date, status")
        .in("property_id", propertyIds)
        .order("start_date", { ascending: false })
        .limit(30);

      if (!error && data) {
        const monthlyData = data.reduce((acc: any, lease) => {
          const month = new Date(lease.start_date).toLocaleDateString("en-US", { month: "short" });
          if (!acc[month]) acc[month] = { month, occupied: 0 };
          if (lease.status === "active") acc[month].occupied += 1;
          return acc;
        }, {});

        setChartData(Object.values(monthlyData).slice(0, 6).reverse());
      }
      setLoading(false);
    };

    loadHistory();
  }, [user]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[150px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Occupancy History</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="occupied" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
