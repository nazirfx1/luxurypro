import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Home, Wrench, MessageSquare, FileText, DollarSign, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    properties: 0,
    leases: 0,
    maintenance: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadStats();
      
      // Real-time subscriptions for dashboard updates
      const channels = [
        supabase.channel('dashboard-properties').on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => loadStats()),
        supabase.channel('dashboard-leases').on('postgres_changes', { event: '*', schema: 'public', table: 'leases' }, () => loadStats()),
        supabase.channel('dashboard-maintenance').on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_requests' }, () => loadStats()),
        supabase.channel('dashboard-messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => loadStats()),
      ];
      
      channels.forEach(channel => channel.subscribe());
      
      return () => {
        channels.forEach(channel => supabase.removeChannel(channel));
      };
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id);

      setProfile(profileData);
      setUserRoles(rolesData || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [propertiesRes, leasesRes, maintenanceRes, messagesRes] = await Promise.all([
        supabase.from("properties").select("id", { count: 'exact', head: true }),
        supabase.from("leases").select("id", { count: 'exact', head: true }).eq("tenant_id", user?.id),
        supabase.from("maintenance_requests").select("id", { count: 'exact', head: true }).eq("tenant_id", user?.id),
        supabase.from("messages").select("id", { count: 'exact', head: true }).eq("recipient_id", user?.id).eq("read", false),
      ]);

      setStats({
        properties: propertiesRes.count || 0,
        leases: leasesRes.count || 0,
        maintenance: maintenanceRes.count || 0,
        messages: messagesRes.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Mock data for charts
  const activityData = [
    { name: 'Mon', requests: 4, messages: 7 },
    { name: 'Tue', requests: 3, messages: 5 },
    { name: 'Wed', requests: 6, messages: 8 },
    { name: 'Thu', requests: 2, messages: 4 },
    { name: 'Fri', requests: 5, messages: 9 },
    { name: 'Sat', requests: 1, messages: 3 },
    { name: 'Sun', requests: 2, messages: 2 },
  ];

  const maintenanceData = [
    { name: 'Pending', value: 3, color: '#fbbf24' },
    { name: 'In Progress', value: 2, color: '#3b82f6' },
    { name: 'Completed', value: 8, color: '#10b981' },
  ];

  const quickActions = [
    { icon: Wrench, label: "New Maintenance", action: () => navigate("/dashboard/maintenance/new"), color: "text-orange-500" },
    { icon: FileText, label: "View Lease", action: () => navigate("/dashboard/lease"), color: "text-blue-500" },
    { icon: MessageSquare, label: "Messages", action: () => navigate("/dashboard/messages"), color: "text-purple-500" },
    { icon: Home, label: "Properties", action: () => navigate("/dashboard/properties"), color: "text-green-500" },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title={`Welcome back, ${profile?.full_name || 'User'}`}
        description="Your real-time analytics and system overview"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Properties</p>
              <p className="text-3xl font-bold mt-1">{stats.properties}</p>
            </div>
            <Home className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Leases</p>
              <p className="text-3xl font-bold mt-1">{stats.leases}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance Requests</p>
              <p className="text-3xl font-bold mt-1">{stats.maintenance}</p>
            </div>
            <Wrench className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
              <p className="text-3xl font-bold mt-1">{stats.messages}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={action.action}
            >
              <action.icon className={`w-6 h-6 ${action.color}`} />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Maintenance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={maintenanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">Maintenance request completed</p>
              <p className="text-sm text-muted-foreground">Kitchen faucet repair - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">New message received</p>
              <p className="text-sm text-muted-foreground">From Property Manager - 5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">Rent payment due</p>
              <p className="text-sm text-muted-foreground">Due in 5 days - $2,500</p>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
