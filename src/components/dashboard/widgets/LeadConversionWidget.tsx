import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export const LeadConversionWidget = () => {
  const [conversion, setConversion] = useState({ leads: 0, converted: 0, rate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversion = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("status");

      if (!error && data) {
        const leads = data.length;
        const converted = data.filter(c => c.status === "active" || c.status === "closed").length;
        const rate = leads > 0 ? (converted / leads) * 100 : 0;

        setConversion({ leads, converted, rate });
      }
      setLoading(false);
    };

    loadConversion();
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
        <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Converted</span>
            <span className="font-medium">{conversion.converted} / {conversion.leads}</span>
          </div>
          <Progress value={conversion.rate} className="h-2" />
          <div className="text-2xl font-bold">{conversion.rate.toFixed(0)}%</div>
        </div>
      </CardContent>
    </Card>
  );
};
