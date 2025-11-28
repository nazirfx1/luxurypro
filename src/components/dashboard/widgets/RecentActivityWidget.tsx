import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const RecentActivityWidget = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      const [properties, leases, maintenance] = await Promise.all([
        supabase.from("properties").select("title, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("leases").select("id, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("maintenance_requests").select("title, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const combined = [
        ...(properties.data || []).map((p) => ({ type: "property", title: p.title, date: p.created_at })),
        ...(leases.data || []).map((l) => ({ type: "lease", title: `Lease ${l.id.slice(0, 8)}`, date: l.created_at })),
        ...(maintenance.data || []).map((m) => ({ type: "maintenance", title: m.title, date: m.created_at })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      setActivities(combined);
      setLoading(false);
    };

    loadActivity();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <Badge variant={activity.type === "property" ? "default" : activity.type === "lease" ? "secondary" : "outline"} className="mt-1">
                  {activity.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.date), "MMM dd, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
