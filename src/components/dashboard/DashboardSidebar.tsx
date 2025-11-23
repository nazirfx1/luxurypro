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
} from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = {
  super_admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/dashboard/properties", icon: Building2 },
    { title: "Users", url: "/dashboard/users", icon: Users },
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
    <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
      <div className="p-4 border-b border-border">
        {!isCollapsed && <img src={logo} alt="Luxury Pro" className="h-10 w-auto" />}
        {isCollapsed && <img src={logo} alt="Luxury Pro" className="h-8 w-auto" />}
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
