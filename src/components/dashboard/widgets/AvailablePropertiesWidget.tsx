import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const AvailablePropertiesWidget = () => {
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (!error) {
        setAvailable(count || 0);
      }
      setLoading(false);
    };

    loadProperties();
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
        <CardTitle className="text-sm font-medium">Available Properties</CardTitle>
        <Home className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{available}</div>
        <p className="text-xs text-muted-foreground mt-1">Ready to show</p>
      </CardContent>
    </Card>
  );
};
