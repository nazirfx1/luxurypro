import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MyEarningsWidget = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ total: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadEarnings = async () => {
      const { data: properties } = await supabase
        .from("properties")
        .select("id")
        .eq("created_by", user.id);

      if (!properties) return;

      const propertyIds = properties.map(p => p.id);
      const { data, error } = await supabase
        .from("financial_records")
        .select("amount, type, record_date")
        .in("property_id", propertyIds)
        .eq("type", "revenue");

      if (!error && data) {
        const total = data.reduce((sum, r) => sum + Number(r.amount), 0);
        const currentMonth = new Date().getMonth();
        const monthly = data
          .filter(r => new Date(r.record_date).getMonth() === currentMonth)
          .reduce((sum, r) => sum + Number(r.amount), 0);

        setEarnings({ total, monthly });
      }
      setLoading(false);
    };

    loadEarnings();
  }, [user]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">My Earnings</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${(earnings.total / 1000).toFixed(1)}K</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600 font-medium">${earnings.monthly.toLocaleString()}</span> this month
        </p>
      </CardContent>
    </Card>
  );
};
