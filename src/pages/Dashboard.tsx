import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Widget imports
import { PropertyStatsWidget } from "@/components/dashboard/widgets/PropertyStatsWidget";
import { RevenueWidget } from "@/components/dashboard/widgets/RevenueWidget";
import { UsersWidget } from "@/components/dashboard/widgets/UsersWidget";
import { LeasesWidget } from "@/components/dashboard/widgets/LeasesWidget";
import { MaintenanceWidget } from "@/components/dashboard/widgets/MaintenanceWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { ChartWidget } from "@/components/dashboard/widgets/ChartWidget";

interface WidgetConfig {
  id: string;
  name: string;
  component: React.ComponentType;
  defaultEnabled: boolean;
}

const AVAILABLE_WIDGETS: WidgetConfig[] = [
  { id: "properties", name: "Properties", component: PropertyStatsWidget, defaultEnabled: true },
  { id: "revenue", name: "Revenue", component: RevenueWidget, defaultEnabled: true },
  { id: "users", name: "Users", component: UsersWidget, defaultEnabled: true },
  { id: "leases", name: "Leases", component: LeasesWidget, defaultEnabled: true },
  { id: "maintenance", name: "Maintenance", component: MaintenanceWidget, defaultEnabled: true },
  { id: "activity", name: "Recent Activity", component: RecentActivityWidget, defaultEnabled: true },
  { id: "chart", name: "Financial Chart", component: ChartWidget, defaultEnabled: true },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadUserRole = async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).order("assigned_at", { ascending: true }).limit(1).single();
      
      if (data?.role) {
        setUserRole(data.role);
        navigate(`/dashboard/${data.role.replace(/_/g, "-")}`);
      }
      setLoading(false);
    };

    loadUserRole();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};

export default Dashboard;
