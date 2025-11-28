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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Tenant Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your lease and requests
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button onClick={() => navigate("/dashboard/maintenance/new")} className="gap-2 whitespace-nowrap flex-shrink-0 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">Request</span>
            </Button>
            <Button onClick={() => navigate("/dashboard/my-lease")} variant="outline" className="gap-2 whitespace-nowrap flex-shrink-0 border-brand-yellow/20 text-white hover:bg-brand-yellow/10">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">View Lease</span>
              <span className="sm:hidden">Lease</span>
            </Button>
            <Button onClick={() => navigate("/dashboard/messages")} variant="outline" className="gap-2 whitespace-nowrap flex-shrink-0 border-brand-yellow/20 text-white hover:bg-brand-yellow/10">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Top Stats Row */}
          <MyLeaseWidget />
          <RentDueWidget />
          <MyMaintenanceRequestsWidget />
          
          {/* Documents and Messages */}
          <div className="lg:col-span-2">
            <LeaseDocumentsWidget />
          </div>
          <div className="lg:col-span-1">
            <TenantMessagesWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
