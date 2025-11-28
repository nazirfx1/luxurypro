import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfitWidget = () => {
  const [profit, setProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfit = async () => {
      const { data } = await supabase.from("financial_records").select("amount, type");
      if (data) {
        const income = data.filter(r => r.type === "revenue").reduce((sum, r) => sum + Number(r.amount), 0);
        const expenses = data.filter(r => r.type === "expense").reduce((sum, r) => sum + Number(r.amount), 0);
        setProfit(income - expenses);
      }
      setLoading(false);
    };
    loadProfit();
  }, []);

  if (loading) return <Card className="h-full"><CardHeader><Skeleton className="h-6 w-32" /></CardHeader></Card>;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
        <DollarSign className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${(profit / 1000).toFixed(1)}K</div>
      </CardContent>
    </Card>
  );
};
