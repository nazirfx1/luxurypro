import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Users, Building2, FileText, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalLeases: 0,
    activeProperties: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30");

  const loadStats = async () => {
    try {
      setLoading(true);

      const [propertiesRes, usersRes, leasesRes] = await Promise.all([
        supabase.from("properties").select("id, status", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("leases").select("id", { count: "exact" }),
      ]);

      const activeProperties = propertiesRes.data?.filter((p) => p.status === "active").length || 0;

      setStats({
        totalProperties: propertiesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalLeases: leasesRes.count || 0,
        activeProperties,
      });
    } catch (error: any) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Realtime updates
    const channels = [
      supabase
        .channel("properties-analytics")
        .on("postgres_changes", { event: "*", schema: "public", table: "properties" }, loadStats)
        .subscribe(),
      supabase
        .channel("users-analytics")
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadStats)
        .subscribe(),
      supabase
        .channel("leases-analytics")
        .on("postgres_changes", { event: "*", schema: "public", table: "leases" }, loadStats)
        .subscribe(),
    ];

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, []);

  const cards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Listings",
      value: stats.activeProperties,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Leases",
      value: stats.totalLeases,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="View comprehensive analytics and reports"
        />

        {/* Timeframe Filter */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Timeframe</h3>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total count
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Occupancy Rate</span>
                  <Badge variant="outline">
                    {stats.totalProperties > 0
                      ? Math.round((stats.totalLeases / stats.totalProperties) * 100)
                      : 0}
                    %
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Listings</span>
                  <Badge variant="outline">{stats.activeProperties}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Users</span>
                  <Badge variant="outline">{stats.totalUsers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Leases</span>
                  <Badge variant="outline">{stats.totalLeases}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
