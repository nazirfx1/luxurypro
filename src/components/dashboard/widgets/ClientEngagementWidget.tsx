import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const ClientEngagementWidget = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEngagement = async () => {
      const { data, error } = await supabase
        .from("client_interactions")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) {
        const dailyData = data.reduce((acc: any, interaction) => {
          const day = new Date(interaction.created_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          if (!acc[day]) acc[day] = { day, count: 0 };
          acc[day].count += 1;
          return acc;
        }, {});

        setChartData(Object.values(dailyData).slice(0, 7).reverse());
      }
      setLoading(false);
    };

    loadEngagement();
  }, []);

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
        <CardTitle className="text-sm font-medium">Client Engagement</CardTitle>
        <Phone className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={chartData}>
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
