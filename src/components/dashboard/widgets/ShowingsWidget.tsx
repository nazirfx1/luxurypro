import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ShowingsWidget = () => {
  const [showings, setShowings] = useState({ total: 0, scheduled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShowings = async () => {
      const { data, error } = await supabase
        .from("client_interactions")
        .select("*")
        .eq("interaction_type", "showing");

      if (!error && data) {
        setShowings({
          total: data.length,
          scheduled: data.filter(s => !s.completed).length,
        });
      }
      setLoading(false);
    };

    loadShowings();
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
        <CardTitle className="text-sm font-medium">Property Showings</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{showings.scheduled}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Scheduled • {showings.total} total
        </p>
      </CardContent>
    </Card>
  );
};
