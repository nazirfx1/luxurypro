import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export const RentDueWidget = () => {
  const { user } = useAuth();
  const [rent, setRent] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("leases").select("monthly_rent").eq("tenant_id", user.id).eq("status", "active").single();
      setRent(data?.monthly_rent || 0);
    };
    load();
  }, [user]);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Rent Due</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${rent}</div>
        <p className="text-xs text-muted-foreground mt-1">Due on the 1st</p>
      </CardContent>
    </Card>
  );
};
