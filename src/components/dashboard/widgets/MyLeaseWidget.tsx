import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const MyLeaseWidget = () => {
  const { user } = useAuth();
  const [lease, setLease] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("leases").select("*, property:property_id(title)").eq("tenant_id", user.id).eq("status", "active").single();
      setLease(data);
    };
    load();
  }, [user]);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">My Lease</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {lease ? (
          <>
            <div className="text-lg font-semibold">{lease.property?.title}</div>
            <p className="text-xs text-muted-foreground mt-1">Ends: {new Date(lease.end_date).toLocaleDateString()}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No active lease</p>
        )}
      </CardContent>
    </Card>
  );
};
