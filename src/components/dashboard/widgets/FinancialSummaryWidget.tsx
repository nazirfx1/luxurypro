import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const FinancialSummaryWidget = () => {
  const [stats, setStats] = useState({ income: 0, expenses: 0, profit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinancials = async () => {
      const { data, error } = await supabase.from("financial_records").select("amount, type");

      if (!error && data) {
        const income = data.filter(r => r.type === "revenue").reduce((sum, r) => sum + Number(r.amount), 0);
        const expenses = data.filter(r => r.type === "expense").reduce((sum, r) => sum + Number(r.amount), 0);
        setStats({ income, expenses, profit: income - expenses });
      }
      setLoading(false);
    };

    loadFinancials();
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
        <CardTitle className="text-sm font-medium">Financial Summary</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Income</p>
            <div className="text-xl font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              ${(stats.income / 1000).toFixed(1)}K
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expenses</p>
            <div className="text-xl font-bold flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              ${(stats.expenses / 1000).toFixed(1)}K
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profit</p>
            <div className="text-xl font-bold">${(stats.profit / 1000).toFixed(1)}K</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
