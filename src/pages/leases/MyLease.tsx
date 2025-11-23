import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Calendar, DollarSign, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Lease {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  payment_day: number;
  status: string;
  terms: string;
  properties: {
    title: string;
    address: string;
  };
}

const MyLease = () => {
  const { user } = useAuth();
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLease();
      
      // Real-time subscription
      const channel = supabase
        .channel('lease-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'leases',
            filter: `tenant_id=eq.${user.id}`
          },
          () => {
            loadLease();
            toast.info("Lease information updated");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadLease = async () => {
    try {
      const { data, error } = await supabase
        .from("leases")
        .select(`
          *,
          properties (
            title,
            address
          )
        `)
        .eq("tenant_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLease(data);
    } catch (error) {
      console.error("Error loading lease:", error);
      toast.error("Failed to load lease information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="My Lease" description="View your lease details and payment history" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lease) {
    return (
      <DashboardLayout>
        <PageHeader title="My Lease" description="View your lease details and payment history" />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No active lease found. Please contact your property manager.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const daysUntilEnd = Math.ceil(
    (new Date(lease.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <DashboardLayout>
      <PageHeader 
        title="My Lease" 
        description="View your lease details and payment history"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Lease" }
        ]}
      />

      {/* Lease Overview Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{lease.properties?.title}</h2>
            <p className="text-muted-foreground">{lease.properties?.address}</p>
          </div>
          <StatusBadge status={lease.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-semibold">{format(new Date(lease.start_date), "MMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-semibold">{format(new Date(lease.end_date), "MMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p className="font-semibold">${lease.monthly_rent.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Day</p>
              <p className="font-semibold">Day {lease.payment_day}</p>
            </div>
          </div>
        </div>

        {daysUntilEnd < 60 && daysUntilEnd > 0 && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your lease expires in {daysUntilEnd} days. Please contact your property manager to discuss renewal options.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lease Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lease ID:</span>
                <span className="font-mono">{lease.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Deposit:</span>
                <span className="font-semibold">${lease.security_deposit?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <StatusBadge status={lease.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{Math.ceil((new Date(lease.end_date).getTime() - new Date(lease.start_date).getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <p className="text-muted-foreground text-sm">Payment tracking coming soon. Your next payment is due on day {lease.payment_day} of each month.</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lease Documents</h3>
            <p className="text-muted-foreground text-sm">Document management coming soon. Contact your property manager for lease documents.</p>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
            <div className="prose prose-sm max-w-none">
              {lease.terms ? (
                <p className="text-sm whitespace-pre-wrap">{lease.terms}</p>
              ) : (
                <p className="text-muted-foreground text-sm">No additional terms specified.</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MyLease;
