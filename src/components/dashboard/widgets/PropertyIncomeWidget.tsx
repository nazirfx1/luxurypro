import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyIncomeWidget = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadIncome = async () => {
      const { data: properties } = await supabase
        .from("properties")
        .select("id, title")
        .eq("created_by", user.id)
        .limit(5);

      if (!properties) return;

      const incomeData = await Promise.all(
        properties.map(async (property) => {
          const { data } = await supabase
            .from("financial_records")
            .select("amount")
            .eq("property_id", property.id)
            .eq("type", "revenue");

          const total = data?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
          return { name: property.title.substring(0, 15), income: total };
        })
      );

      setChartData(incomeData);
      setLoading(false);
    };

    loadIncome();
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
        <CardTitle className="text-sm font-medium">Income by Property</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" fontSize={10} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
