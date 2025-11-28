import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load saved widgets from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem("dashboard-widgets");
    if (savedWidgets) {
      setActiveWidgets(JSON.parse(savedWidgets));
    } else {
      setActiveWidgets(AVAILABLE_WIDGETS.filter(w => w.defaultEnabled).map((w) => w.id));
    }
  }, []);

  const handleResetLayout = () => {
    setActiveWidgets(AVAILABLE_WIDGETS.filter(w => w.defaultEnabled).map((w) => w.id));
    localStorage.removeItem("dashboard-widgets");
    toast.success("Dashboard layout reset to default");
  };

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets((prev) => {
      const newWidgets = prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId];
      
      localStorage.setItem("dashboard-widgets", JSON.stringify(newWidgets));
      return newWidgets;
    });
  };

  const activeWidgetConfigs = AVAILABLE_WIDGETS.filter((w) =>
    activeWidgets.includes(w.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your overview
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(true)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Widgets
            </Button>
            <Button
              variant="outline"
              onClick={handleResetLayout}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Dashboard Grid - Simple CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
          {activeWidgetConfigs.map((widget) => {
            const WidgetComponent = widget.component;
            // Chart and Activity widgets span more columns
            const isWide = widget.id === 'chart';
            const isTall = widget.id === 'activity' || widget.id === 'chart';
            
            return (
              <div
                key={widget.id}
                className={`${isWide ? 'lg:col-span-2' : ''} ${isTall ? 'row-span-2' : ''}`}
              >
                <WidgetComponent />
              </div>
            );
          })}
        </div>

        {/* Widget Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Widgets</DialogTitle>
              <DialogDescription>
                Select which widgets to display on your dashboard
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {AVAILABLE_WIDGETS.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={widget.id}
                    checked={activeWidgets.includes(widget.id)}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <Label
                    htmlFor={widget.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {widget.name}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
