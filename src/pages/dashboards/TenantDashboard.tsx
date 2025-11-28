import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyLeaseWidget } from "@/components/dashboard/widgets/MyLeaseWidget";
import { RentDueWidget } from "@/components/dashboard/widgets/RentDueWidget";
import { MyMaintenanceRequestsWidget } from "@/components/dashboard/widgets/MyMaintenanceRequestsWidget";
import { LeaseDocumentsWidget } from "@/components/dashboard/widgets/LeaseDocumentsWidget";
import { TenantMessagesWidget } from "@/components/dashboard/widgets/TenantMessagesWidget";
import { Button } from "@/components/ui/button";
import { Wrench, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TenantDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your lease and requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/maintenance/new")} className="gap-2">
              <Wrench className="w-4 h-4" />
              New Request
            </Button>
            <Button onClick={() => navigate("/dashboard/my-lease")} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              View Lease
            </Button>
            <Button onClick={() => navigate("/dashboard/messages")} variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Stats Row */}
          <MyLeaseWidget />
          <RentDueWidget />
          <MyMaintenanceRequestsWidget />
          
          {/* Documents and Messages */}
          <div className="lg:col-span-2 row-span-2">
            <LeaseDocumentsWidget />
          </div>
          <div className="lg:col-span-1 row-span-2">
            <TenantMessagesWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
