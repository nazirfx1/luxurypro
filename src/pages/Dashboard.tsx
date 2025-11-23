import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      // Load roles
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {profile?.full_name}</h1>
          <p className="text-muted-foreground mt-2">Your enterprise dashboard overview</p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Email</h3>
            <p className="text-lg font-semibold">{profile?.email}</p>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Phone</h3>
            <p className="text-lg font-semibold">{profile?.phone || "Not set"}</p>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Roles</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {userRoles.map((ur, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize"
                >
                  {ur.role.replace("_", " ")}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Placeholder for role-specific content */}
        <Card className="p-8 shadow-card">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Dashboard Under Development</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your role-specific dashboard with KPIs, charts, and quick actions is being built in the next phase. 
              Navigate through the sidebar to explore the property management, client tracking, and financial modules.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
