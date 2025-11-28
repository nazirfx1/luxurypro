import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const UsersWidget = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (!error) {
        setUserCount(count || 0);
      }
      setLoading(false);
    };

    loadUsers();

    const channel = supabase
      .channel("users-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{userCount}</div>
        <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
        <div className="flex items-center text-xs text-blue-600 mt-2">
          <TrendingUp className="w-3 h-3 mr-1" />
          Growing
        </div>
      </CardContent>
    </Card>
  );
};
