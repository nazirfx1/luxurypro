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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Property Owner Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Track your properties and earnings
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button onClick={() => navigate("/dashboard/properties")} className="gap-2 whitespace-nowrap flex-shrink-0 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Media</span>
              <span className="sm:hidden">Upload</span>
            </Button>
            <Button onClick={() => navigate("/dashboard/financials")} variant="outline" className="gap-2 whitespace-nowrap flex-shrink-0 border-brand-yellow/20 text-white hover:bg-brand-yellow/10">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">View Reports</span>
              <span className="sm:hidden">Reports</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {/* Top Stats Row */}
          <MyPropertiesWidget />
          <MyEarningsWidget />
          <MyLeasesWidget />
          <MyMaintenanceWidget />
          
          {/* Analytics Row */}
          <div className="md:col-span-2">
            <PropertyIncomeWidget />
          </div>
          <div className="md:col-span-2">
            <OccupancyHistoryWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyOwnerDashboard;
