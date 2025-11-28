import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LeaseRenewalWidget = () => {
  const [renewals, setRenewals] = useState({ upcoming: 0, expired: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRenewals = async () => {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from("leases")
        .select("end_date, status");

      if (!error && data) {
        const upcoming = data.filter(l => {
          const endDate = new Date(l.end_date);
          return l.status === "active" && endDate >= today && endDate <= thirtyDaysFromNow;
        }).length;

        const expired = data.filter(l => {
          const endDate = new Date(l.end_date);
          return l.status === "active" && endDate < today;
        }).length;

        setRenewals({ upcoming, expired });
      }
      setLoading(false);
    };

    loadRenewals();
  }, []);

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
        <CardTitle className="text-sm font-medium">Lease Renewals</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Upcoming (30 days):</span>
            <span className="font-semibold text-orange-600">{renewals.upcoming}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expired:</span>
            <span className="font-semibold text-red-600">{renewals.expired}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
