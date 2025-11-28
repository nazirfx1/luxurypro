import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const TotalIncomeWidget = () => {
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncome = async () => {
      const { data } = await supabase.from("financial_records").select("amount").eq("type", "revenue");
      setIncome(data?.reduce((sum, r) => sum + Number(r.amount), 0) || 0);
      setLoading(false);
    };
    loadIncome();
  }, []);

  if (loading) return <Card className="h-full"><CardHeader><Skeleton className="h-6 w-32" /></CardHeader></Card>;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">${(income / 1000).toFixed(1)}K</div>
      </CardContent>
    </Card>
  );
};
