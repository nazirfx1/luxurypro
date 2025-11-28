import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientsOverviewWidget } from "@/components/dashboard/widgets/ClientsOverviewWidget";
import { ShowingsWidget } from "@/components/dashboard/widgets/ShowingsWidget";
import { AvailablePropertiesWidget } from "@/components/dashboard/widgets/AvailablePropertiesWidget";
import { ClientEngagementWidget } from "@/components/dashboard/widgets/ClientEngagementWidget";
import { LeadConversionWidget } from "@/components/dashboard/widgets/LeadConversionWidget";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesAgentDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Agent Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage clients and drive property sales
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/clients")} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Client
            </Button>
            <Button onClick={() => navigate("/dashboard/clients")} variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Showing
            </Button>
            <Button onClick={() => navigate("/dashboard/clients")} variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Log Interaction
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <ClientsOverviewWidget />
          <ShowingsWidget />
          <AvailablePropertiesWidget />
          
          {/* Analytics Row */}
          <div className="lg:col-span-2">
            <LeadConversionWidget />
          </div>
          <div className="lg:col-span-2">
            <ClientEngagementWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesAgentDashboard;
