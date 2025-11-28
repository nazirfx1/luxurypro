import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const FinancialSnapshotWidget = () => {
  const [snapshot, setSnapshot] = useState({ revenue: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnapshot = async () => {
      const currentMonth = new Date().getMonth();
      const { data, error } = await supabase
        .from("financial_records")
        .select("amount, type, record_date");

      if (!error && data) {
        const monthly = data.filter(r => new Date(r.record_date).getMonth() === currentMonth);
        setSnapshot({
          revenue: monthly.filter(r => r.type === "revenue").reduce((sum, r) => sum + Number(r.amount), 0),
          expenses: monthly.filter(r => r.type === "expense").reduce((sum, r) => sum + Number(r.amount), 0),
        });
      }
      setLoading(false);
    };

    loadSnapshot();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">This Month</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <div className="text-2xl font-bold text-green-600">${snapshot.revenue.toLocaleString()}</div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expenses</p>
            <div className="text-2xl font-bold text-red-600">${snapshot.expenses.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
