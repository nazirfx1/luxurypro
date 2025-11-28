import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
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
import logo from "@/assets/logo.png";

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
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const currentPath = location.pathname;
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

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} bg-sidebar-bg border-r border-sidebar-bg transition-all duration-300`}>
      {/* Logo Section */}
      <div className={`${isCollapsed ? "p-3" : "p-6"} border-b border-sidebar-bg/50 flex items-center justify-center transition-all duration-300`}>
        {!isCollapsed && (
          <img src={logo} alt="Luxury Pro" className="h-12 w-auto filter brightness-0 invert" />
        )}
        {isCollapsed && (
          <img src={logo} alt="Luxury Pro" className="h-8 w-auto filter brightness-0 invert" />
        )}
      </div>

      <SidebarContent className="bg-sidebar-bg">
        <SidebarGroup className="px-0">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-6 py-3 text-sidebar-text/60 text-xs font-semibold uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`
                          group relative flex items-center gap-3 rounded-lg px-3 py-3
                          text-sidebar-text font-medium text-[15px]
                          transition-all duration-200 ease-in-out
                          hover:bg-sidebar-hover hover:text-sidebar-active-text hover:shadow-lg
                          ${isCollapsed ? "justify-center" : ""}
                          ${isActive 
                            ? "bg-sidebar-active-bg text-sidebar-active-text shadow-[0_0_20px_rgba(201,164,0,0.3)] border-l-4 border-sidebar-border" 
                            : "hover:translate-x-1"
                          }
                        `}
                        activeClassName=""
                      >
                        <item.icon 
                          className={`
                            ${isCollapsed ? "h-5 w-5" : "h-5 w-5"} 
                            flex-shrink-0
                            ${isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
                          `} 
                          strokeWidth={1.5}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
