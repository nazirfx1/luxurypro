import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PropertyStatsWidget } from "@/components/dashboard/widgets/PropertyStatsWidget";
import { LeasesWidget } from "@/components/dashboard/widgets/LeasesWidget";
import { MaintenanceWidget } from "@/components/dashboard/widgets/MaintenanceWidget";
import { PropertyOccupancyWidget } from "@/components/dashboard/widgets/PropertyOccupancyWidget";
import { LeaseRenewalWidget } from "@/components/dashboard/widgets/LeaseRenewalWidget";
import { RevenueWidget } from "@/components/dashboard/widgets/RevenueWidget";
import { MessagesOverviewWidget } from "@/components/dashboard/widgets/MessagesOverviewWidget";
import { Button } from "@/components/ui/button";
import { FileText, Wrench, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage properties, leases, and maintenance operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/leases")} className="gap-2">
              <FileText className="w-4 h-4" />
              Create Lease
            </Button>
            <Button onClick={() => navigate("/dashboard/maintenance")} variant="outline" className="gap-2">
              <Wrench className="w-4 h-4" />
              Assign Maintenance
            </Button>
            <Button onClick={() => navigate("/dashboard/messages")} variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <PropertyStatsWidget />
          <LeasesWidget />
          <MaintenanceWidget />
          <RevenueWidget />
          
          {/* Analytics Row */}
          <div className="lg:col-span-2">
            <PropertyOccupancyWidget />
          </div>
          <div className="lg:col-span-2">
            <LeaseRenewalWidget />
          </div>
          
          {/* Messages Panel */}
          <div className="lg:col-span-4 row-span-2">
            <MessagesOverviewWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
