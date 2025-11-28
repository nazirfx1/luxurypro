import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyPropertiesWidget } from "@/components/dashboard/widgets/MyPropertiesWidget";
import { MyEarningsWidget } from "@/components/dashboard/widgets/MyEarningsWidget";
import { MyLeasesWidget } from "@/components/dashboard/widgets/MyLeasesWidget";
import { MyMaintenanceWidget } from "@/components/dashboard/widgets/MyMaintenanceWidget";
import { PropertyIncomeWidget } from "@/components/dashboard/widgets/PropertyIncomeWidget";
import { OccupancyHistoryWidget } from "@/components/dashboard/widgets/OccupancyHistoryWidget";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyOwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your properties and earnings
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/properties")} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
            <Button onClick={() => navigate("/dashboard/financials")} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <MyPropertiesWidget />
          <MyEarningsWidget />
          <MyLeasesWidget />
          <MyMaintenanceWidget />
          
          {/* Analytics Row */}
          <div className="lg:col-span-2">
            <PropertyIncomeWidget />
          </div>
          <div className="lg:col-span-2">
            <OccupancyHistoryWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyOwnerDashboard;
