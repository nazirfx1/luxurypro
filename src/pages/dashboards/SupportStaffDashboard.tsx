import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AssignedTasksWidget } from "@/components/dashboard/widgets/AssignedTasksWidget";
import { PendingTasksWidget } from "@/components/dashboard/widgets/PendingTasksWidget";
import { CompletedTasksWidget } from "@/components/dashboard/widgets/CompletedTasksWidget";
import { TaskPerformanceWidget } from "@/components/dashboard/widgets/TaskPerformanceWidget";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SupportStaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage maintenance tasks and operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/maintenance")} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Update Status
            </Button>
            <Button onClick={() => navigate("/dashboard/maintenance")} variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Stats Row */}
          <AssignedTasksWidget />
          <PendingTasksWidget />
          <CompletedTasksWidget />
          
          {/* Performance Chart */}
          <div className="lg:col-span-3">
            <TaskPerformanceWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportStaffDashboard;
