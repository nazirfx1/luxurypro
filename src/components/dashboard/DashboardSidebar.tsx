import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
  UserCog,
  Shield,
} from "lucide-react";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import { ModernSidebarGroup } from "./ModernSidebarGroup";
import { ModernSidebarItem } from "./ModernSidebarItem";
import { ModernSidebarFooter } from "./ModernSidebarFooter";
import { cn } from "@/lib/utils";

const menuItems = {
  super_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Users", url: "/dashboard/users", icon: Users },
    { title: "Permissions", url: "/dashboard/permissions", icon: Shield },
    { title: "Clients", url: "/dashboard/clients", icon: UserCog },
    { title: "Leases", url: "/dashboard/leases", icon: FileText },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Financials", url: "/dashboard/financials", icon: DollarSign },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Users", url: "/dashboard/users", icon: Users },
    { title: "Permissions", url: "/dashboard/permissions", icon: Shield },
    { title: "Clients", url: "/dashboard/clients", icon: UserCog },
    { title: "Leases", url: "/dashboard/leases", icon: FileText },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Financials", url: "/dashboard/financials", icon: DollarSign },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  ],
  manager: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Leases", url: "/dashboard/leases", icon: FileText },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
    { title: "Financials", url: "/dashboard/financials", icon: DollarSign },
  ],
  sales_agent: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Clients", url: "/dashboard/clients", icon: UserCog },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  ],
  property_owner: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Financials", url: "/dashboard/financials", icon: DollarSign },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  ],
  tenant: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Lease", url: "/dashboard/lease", icon: FileText },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  ],
  support_staff: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Maintenance", url: "/dashboard/maintenance", icon: Wrench },
    { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  ],
  accountant: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Financials", url: "/dashboard/financials", icon: DollarSign },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  ],
};

export const DashboardSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    if (user) {
      loadUserRole();
    }
  }, [user]);

  const loadUserRole = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id)
      .order("assigned_at", { ascending: true })
      .limit(1)
      .single();

    if (data) {
      setUserRole(data.role);
    }
  };

  const items = userRole ? menuItems[userRole as keyof typeof menuItems] || menuItems.tenant : menuItems.tenant;

  // Group items by category
  const mainItems = items.filter(item => 
    ["Dashboard", "Properties", "My Properties", "My Lease"].includes(item.title)
  );
  
  const managementItems = items.filter(item =>
    ["Users", "Permissions", "Clients", "Leases"].includes(item.title)
  );
  
  const operationsItems = items.filter(item =>
    ["Maintenance", "Messages"].includes(item.title)
  );
  
  const financialItems = items.filter(item =>
    ["Financials", "Analytics"].includes(item.title)
  );
  
  const settingsItems = items.filter(item =>
    item.title === "Settings"
  );

  return (
    <div
      className={cn(
        "h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <img src={logo} alt="Luxury Pro" className="h-10 w-auto" />
        )}
        {isCollapsed && (
          <img src={logo} alt="Luxury Pro" className="h-8 w-auto mx-auto" />
        )}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-sidebar-hover/10 text-sidebar-foreground hover:text-sidebar-hover transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {/* Main Navigation */}
        {mainItems.length > 0 && (
          <ModernSidebarGroup title="Main" isCollapsed={isCollapsed} defaultOpen={true}>
            {mainItems.map((item) => (
              <ModernSidebarItem
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ModernSidebarGroup>
        )}

        {/* Management */}
        {managementItems.length > 0 && (
          <ModernSidebarGroup title="Management" isCollapsed={isCollapsed} defaultOpen={true}>
            {managementItems.map((item) => (
              <ModernSidebarItem
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ModernSidebarGroup>
        )}

        {/* Operations */}
        {operationsItems.length > 0 && (
          <ModernSidebarGroup title="Operations" isCollapsed={isCollapsed} defaultOpen={true}>
            {operationsItems.map((item) => (
              <ModernSidebarItem
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ModernSidebarGroup>
        )}

        {/* Financial */}
        {financialItems.length > 0 && (
          <ModernSidebarGroup title="Financial" isCollapsed={isCollapsed} defaultOpen={true}>
            {financialItems.map((item) => (
              <ModernSidebarItem
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ModernSidebarGroup>
        )}

        {/* Settings */}
        {settingsItems.length > 0 && (
          <ModernSidebarGroup title="System" isCollapsed={isCollapsed} defaultOpen={false}>
            {settingsItems.map((item) => (
              <ModernSidebarItem
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </ModernSidebarGroup>
        )}
      </div>

      {/* Footer */}
      <ModernSidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};
