import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const RevenueWidget = () => {
  const [revenue, setRevenue] = useState({ total: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenue = async () => {
      const { data, error } = await supabase
        .from("financial_records")
        .select("amount, type, record_date");

      if (!error && data) {
        const totalRevenue = data
          .filter((r) => r.type === "revenue")
          .reduce((sum, r) => sum + parseFloat(r.amount as any), 0);

        const currentMonth = new Date().getMonth();
        const monthlyRevenue = data
          .filter((r) => r.type === "revenue" && new Date(r.record_date).getMonth() === currentMonth)
          .reduce((sum, r) => sum + parseFloat(r.amount as any), 0);

        setRevenue({ total: totalRevenue, monthly: monthlyRevenue });
      }
      setLoading(false);
    };

    loadRevenue();

    const channel = supabase
      .channel("financials-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "financial_records" }, loadRevenue)
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
          <Skeleton className="h-12 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${(revenue.total / 1000).toFixed(1)}K</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600 font-medium">${revenue.monthly.toLocaleString()}</span> this month
        </p>
        <div className="flex items-center text-xs text-green-600 mt-2">
          <TrendingUp className="w-3 h-3 mr-1" />
          {revenue.total > 0 ? `${((revenue.monthly / revenue.total) * 100).toFixed(0)}%` : "0%"} of total
        </div>
      </CardContent>
    </Card>
  );
};
