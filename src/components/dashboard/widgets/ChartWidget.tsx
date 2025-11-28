import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const ChartWidget = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      const { data, error } = await supabase
        .from("financial_records")
        .select("amount, type, record_date")
        .order("record_date", { ascending: false })
        .limit(30);

      if (!error && data) {
        const monthlyData = data.reduce((acc: any, record) => {
          const month = new Date(record.record_date).toLocaleDateString("en-US", {
            month: "short",
          });

          if (!acc[month]) {
            acc[month] = { month, revenue: 0, expenses: 0 };
          }

          if (record.type === "revenue") {
            acc[month].revenue += parseFloat(record.amount as any);
          } else {
            acc[month].expenses += parseFloat(record.amount as any);
          }

          return acc;
        }, {});

        setChartData(Object.values(monthlyData).slice(0, 6).reverse());
      }
      setLoading(false);
    };

    loadChartData();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Financial Overview</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
