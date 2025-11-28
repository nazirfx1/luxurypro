import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, Plus, Edit, FileText, Calendar } from "lucide-react";

type Lease = {
  id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number | null;
  status: string | null;
  payment_day: number | null;
  created_at: string | null;
  properties?: {
    title: string;
    address: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
};

const LeasesList = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState<Lease[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [formData, setFormData] = useState({
    property_id: "",
    tenant_id: "",
    start_date: "",
    end_date: "",
    monthly_rent: "",
    security_deposit: "",
    status: "active",
    payment_day: "1",
  });

  const loadLeases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leases")
        .select(`
          *,
          properties!leases_property_id_fkey(title, address),
          profiles!leases_tenant_id_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeases(data || []);
    } catch (error: any) {
      console.error("Error loading leases:", error);
      toast.error("Failed to load leases");
    } finally {
      setLoading(false);
    }
  };

  const loadPropertiesAndTenants = async () => {
    try {
      const [propertiesRes, tenantsRes] = await Promise.all([
        supabase.from("properties").select("id, title, address"),
        supabase.from("profiles").select("id, full_name, email"),
      ]);

      setProperties(propertiesRes.data || []);
      setTenants(tenantsRes.data || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadLeases();
    loadPropertiesAndTenants();

    const channel = supabase
      .channel("leases-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leases" },
        () => loadLeases()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLeases = leases.filter((lease) => {
    const matchesSearch =
      lease.properties?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = async () => {
    try {
      const leaseData = {
        property_id: formData.property_id,
        tenant_id: formData.tenant_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        monthly_rent: Number(formData.monthly_rent),
        security_deposit: formData.security_deposit ? Number(formData.security_deposit) : null,
        status: formData.status,
        payment_day: Number(formData.payment_day),
      };

      if (selectedLease) {
        const { error } = await supabase
          .from("leases")
          .update(leaseData)
          .eq("id", selectedLease.id);
        if (error) throw error;
        toast.success("Lease updated successfully");
      } else {
        const { error } = await supabase.from("leases").insert([leaseData]);
        if (error) throw error;
        toast.success("Lease created successfully");
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving lease:", error);
      toast.error("Failed to save lease");
    }
  };

  const handleEdit = (lease: Lease) => {
    setSelectedLease(lease);
    setFormData({
      property_id: lease.property_id,
      tenant_id: lease.tenant_id,
      start_date: lease.start_date,
      end_date: lease.end_date,
      monthly_rent: lease.monthly_rent.toString(),
      security_deposit: lease.security_deposit?.toString() || "",
      status: lease.status || "active",
      payment_day: lease.payment_day?.toString() || "1",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedLease(null);
    setFormData({
      property_id: "",
      tenant_id: "",
      start_date: "",
      end_date: "",
      monthly_rent: "",
      security_deposit: "",
      status: "active",
      payment_day: "1",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Leases"
          description="Manage all property leases"
        />

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              New Lease
            </Button>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLeases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No leases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lease.properties?.title}</div>
                        <div className="text-sm text-muted-foreground">{lease.properties?.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lease.profiles?.full_name}</div>
                        <div className="text-sm text-muted-foreground">{lease.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${lease.monthly_rent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lease.status === "active" ? "default" : "outline"}>
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lease)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedLease ? "Edit Lease" : "New Lease"}</DialogTitle>
              <DialogDescription>
                {selectedLease ? "Update lease information" : "Create a new lease agreement"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Property *</Label>
                <Select value={formData.property_id} onValueChange={(v) => setFormData({ ...formData, property_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} - {p.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Tenant *</Label>
                <Select value={formData.tenant_id} onValueChange={(v) => setFormData({ ...formData, tenant_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.full_name} - {t.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent *</Label>
                <Input
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Security Deposit</Label>
                <Input
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.payment_day}
                  onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedLease ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default LeasesList;
