import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, Grip, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetConfig {
  id: string;
  name: string;
  component: React.ComponentType;
  minW?: number;
  minH?: number;
}

const AVAILABLE_WIDGETS: WidgetConfig[] = [
  { id: "properties", name: "Properties", component: PropertyStatsWidget, minW: 2, minH: 2 },
  { id: "revenue", name: "Revenue", component: RevenueWidget, minW: 2, minH: 2 },
  { id: "users", name: "Users", component: UsersWidget, minW: 2, minH: 2 },
  { id: "leases", name: "Leases", component: LeasesWidget, minW: 2, minH: 2 },
  { id: "maintenance", name: "Maintenance", component: MaintenanceWidget, minW: 2, minH: 2 },
  { id: "activity", name: "Recent Activity", component: RecentActivityWidget, minW: 3, minH: 4 },
  { id: "chart", name: "Financial Chart", component: ChartWidget, minW: 4, minH: 3 },
];

const DEFAULT_LAYOUT: Layout[] = [
  { i: "properties", x: 0, y: 0, w: 3, h: 2 },
  { i: "revenue", x: 3, y: 0, w: 3, h: 2 },
  { i: "users", x: 6, y: 0, w: 3, h: 2 },
  { i: "leases", x: 9, y: 0, w: 3, h: 2 },
  { i: "maintenance", x: 0, y: 2, w: 3, h: 2 },
  { i: "chart", x: 3, y: 2, w: 6, h: 3 },
  { i: "activity", x: 9, y: 2, w: 3, h: 4 },
];

const Dashboard = () => {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboard-layout");
    const savedWidgets = localStorage.getItem("dashboard-widgets");

    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(DEFAULT_LAYOUT);
    }

    if (savedWidgets) {
      setActiveWidgets(JSON.parse(savedWidgets));
    } else {
      setActiveWidgets(AVAILABLE_WIDGETS.map((w) => w.id));
    }
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (editMode) {
      setLayout(newLayout);
    }
  };

  const handleSaveLayout = () => {
    localStorage.setItem("dashboard-layout", JSON.stringify(layout));
    localStorage.setItem("dashboard-widgets", JSON.stringify(activeWidgets));
    setEditMode(false);
    toast.success("Dashboard layout saved");
  };

  const handleResetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    setActiveWidgets(AVAILABLE_WIDGETS.map((w) => w.id));
    localStorage.removeItem("dashboard-layout");
    localStorage.removeItem("dashboard-widgets");
    toast.success("Dashboard layout reset to default");
  };

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets((prev) => {
      const isRemoving = prev.includes(widgetId);
      const newWidgets = isRemoving
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId];

      // If adding a widget, ensure it has layout data
      if (!isRemoving) {
        setLayout((currentLayout) => {
          // Check if this widget already has layout data
          const hasLayout = currentLayout.some((item) => item.i === widgetId);
          if (!hasLayout) {
            // Find the widget config to get default size
            const widgetConfig = AVAILABLE_WIDGETS.find((w) => w.id === widgetId);
            const defaultWidth = widgetConfig?.minW || 3;
            const defaultHeight = widgetConfig?.minH || 2;
            
            // Add default layout for this widget
            const newLayoutItem = {
              i: widgetId,
              x: 0,
              y: Infinity, // Puts it at the bottom
              w: defaultWidth,
              h: defaultHeight,
            };
            return [...currentLayout, newLayoutItem];
          }
          return currentLayout;
        });
      }

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
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveLayout} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Layout
                </Button>
              </>
            ) : (
              <>
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
                <Button onClick={() => setEditMode(true)} className="gap-2">
                  <Grip className="w-4 h-4" />
                  Customize
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editMode && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grip className="w-5 h-5 text-primary" />
              <p className="font-medium">
                Drag & drop widgets to customize your dashboard
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={80}
          onLayoutChange={handleLayoutChange}
          isDraggable={editMode}
          isResizable={editMode}
          compactType="vertical"
          preventCollision={false}
        >
          {activeWidgetConfigs.map((widget) => {
            const WidgetComponent = widget.component;
            return (
              <div
                key={widget.id}
                className={editMode ? "cursor-move" : ""}
                data-grid={{
                  minW: widget.minW || 2,
                  minH: widget.minH || 2,
                }}
              >
                <WidgetComponent />
              </div>
            );
          })}
        </ResponsiveGridLayout>

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
