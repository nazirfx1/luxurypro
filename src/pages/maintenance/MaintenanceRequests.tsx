import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Search, Filter, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  scheduled_date: string | null;
  properties: {
    title: string;
    address: string;
  };
}

const MaintenanceRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      loadRequests();
      
      // Real-time subscription
      const channel = supabase
        .channel('maintenance-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'maintenance_requests',
            filter: `tenant_id=eq.${user.id}`
          },
          () => {
            loadRequests();
            toast.info("Maintenance requests updated");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select(`
          *,
          properties (
            title,
            address
          )
        `)
        .eq("tenant_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error loading maintenance requests:", error);
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const priorityDist = ["low", "medium", "high", "urgent"].map((priority) => ({
    name: priority,
    value: requests.filter((r) => r.priority === priority).length,
  })).filter((p) => p.value > 0);

  const CHART_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Maintenance Requests" 
        description="Submit and track your maintenance requests"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Maintenance" }
        ]}
        actions={
          <Button onClick={() => navigate("/dashboard/maintenance/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-500">{stats.in_progress}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold mt-1 text-green-500">{stats.completed}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Button>
          <ExportMenu data={filteredRequests} filename="maintenance-requests" />
        </div>
      </Card>

      {/* Analytics */}
      {showAnalytics && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Request Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityDist}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {priorityDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No maintenance requests found</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard/maintenance/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Submit Your First Request
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <Card 
              key={request.id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboard/maintenance/${request.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{request.title}</h3>
                    <StatusBadge status={request.status} />
                    <StatusBadge status={request.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Property: <span className="font-medium text-foreground">{request.properties?.title}</span>
                    </span>
                    {request.category && (
                      <Badge variant="outline">{request.category}</Badge>
                    )}
                    <span className="text-muted-foreground">
                      Created: {format(new Date(request.created_at), "MMM dd, yyyy")}
                    </span>
                    {request.scheduled_date && (
                      <span className="text-muted-foreground">
                        Scheduled: {format(new Date(request.scheduled_date), "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MaintenanceRequests;
