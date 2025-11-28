import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UsersWidget } from "@/components/dashboard/widgets/UsersWidget";
import { PropertyStatsWidget } from "@/components/dashboard/widgets/PropertyStatsWidget";
import { RevenueWidget } from "@/components/dashboard/widgets/RevenueWidget";
import { LeasesWidget } from "@/components/dashboard/widgets/LeasesWidget";
import { MaintenanceWidget } from "@/components/dashboard/widgets/MaintenanceWidget";
import { ChartWidget } from "@/components/dashboard/widgets/ChartWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { ClientsOverviewWidget } from "@/components/dashboard/widgets/ClientsOverviewWidget";
import { FinancialSummaryWidget } from "@/components/dashboard/widgets/FinancialSummaryWidget";
import { RoleDistributionWidget } from "@/components/dashboard/widgets/RoleDistributionWidget";
import { SystemStatsWidget } from "@/components/dashboard/widgets/SystemStatsWidget";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Complete system oversight and control
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/user-management")} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Create User
            </Button>
            <Button onClick={() => navigate("/dashboard/properties/new")} variant="outline" className="gap-2">
              <Building2 className="w-4 h-4" />
              Add Property
            </Button>
            <Button onClick={() => navigate("/dashboard/permission-management")} variant="outline" className="gap-2">
              <Shield className="w-4 h-4" />
              Permissions
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <SystemStatsWidget />
          <UsersWidget />
          <PropertyStatsWidget />
          <ClientsOverviewWidget />
          
          {/* Financial Row */}
          <div className="lg:col-span-2">
            <FinancialSummaryWidget />
          </div>
          <LeasesWidget />
          <MaintenanceWidget />
          
          {/* Charts Row */}
          <div className="lg:col-span-2 row-span-2">
            <ChartWidget />
          </div>
          <div className="lg:col-span-2 row-span-2">
            <RoleDistributionWidget />
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

export default SuperAdminDashboard;
