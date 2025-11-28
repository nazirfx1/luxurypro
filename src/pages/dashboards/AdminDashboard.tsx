import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UsersWidget } from "@/components/dashboard/widgets/UsersWidget";
import { PropertyStatsWidget } from "@/components/dashboard/widgets/PropertyStatsWidget";
import { LeasesWidget } from "@/components/dashboard/widgets/LeasesWidget";
import { MaintenanceWidget } from "@/components/dashboard/widgets/MaintenanceWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { UserGrowthWidget } from "@/components/dashboard/widgets/UserGrowthWidget";
import { PropertyOccupancyWidget } from "@/components/dashboard/widgets/PropertyOccupancyWidget";
import { FinancialSnapshotWidget } from "@/components/dashboard/widgets/FinancialSnapshotWidget";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, properties, and system operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/user-management")} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Manage Users
            </Button>
            <Button onClick={() => navigate("/dashboard/analytics")} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <UsersWidget />
          <PropertyStatsWidget />
          <LeasesWidget />
          <MaintenanceWidget />
          
          {/* Analytics Row */}
          <div className="lg:col-span-2">
            <UserGrowthWidget />
          </div>
          <div className="lg:col-span-2">
            <PropertyOccupancyWidget />
          </div>
          
          {/* Financial Snapshot */}
          <div className="lg:col-span-4">
            <FinancialSnapshotWidget />
          </div>
          
          {/* Activity Row */}
          <div className="lg:col-span-4 row-span-2">
            <RecentActivityWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
