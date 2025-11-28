import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MyPropertiesWidget = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("status")
        .eq("created_by", user.id);

      if (!error && data) {
        setStats({
          total: data.length,
          active: data.filter(p => p.status === "active").length,
        });
      }
      setLoading(false);
    };

    loadProperties();
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
        <CardTitle className="text-sm font-medium">My Properties</CardTitle>
        <Home className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600 font-medium">{stats.active}</span> active
        </p>
      </CardContent>
    </Card>
  );
};
