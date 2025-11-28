import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  UserCog, 
  Users, 
  Building2, 
  FileText, 
  Wrench, 
  MessageSquare, 
  DollarSign, 
  BarChart3,
  Settings,
  CheckCircle2
} from "lucide-react";

const roleData = {
  super_admin: {
    title: "Super Admin",
    description: "Full system access with all administrative privileges",
    color: "bg-destructive",
    icon: Shield,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Properties", icon: "Building2" },
      { name: "Users", icon: "Users" },
      { name: "Permissions", icon: "Shield" },
      { name: "Clients", icon: "UserCog" },
      { name: "Leases", icon: "FileText" },
      { name: "Maintenance", icon: "Wrench" },
      { name: "Messages", icon: "MessageSquare" },
      { name: "Financials", icon: "DollarSign" },
      { name: "Analytics", icon: "BarChart3" },
      { name: "Settings", icon: "Settings" },
    ],
    capabilities: [
      "Create, read, update, delete all users",
      "Assign and modify user roles",
      "Manage all permissions and role assignments",
      "Full access to all properties",
      "Manage all leases and tenants",
      "View and manage all financial records",
      "Access all analytics and reports",
      "View all activity logs",
      "Configure system settings",
      "Manage all maintenance requests",
    ],
    restrictions: [],
  },
  admin: {
    title: "Admin",
    description: "Administrative access without system configuration rights",
    color: "bg-primary",
    icon: UserCog,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Properties", icon: "Building2" },
      { name: "Users", icon: "Users" },
      { name: "Permissions", icon: "Shield" },
      { name: "Clients", icon: "UserCog" },
      { name: "Leases", icon: "FileText" },
      { name: "Maintenance", icon: "Wrench" },
      { name: "Messages", icon: "MessageSquare" },
      { name: "Financials", icon: "DollarSign" },
      { name: "Analytics", icon: "BarChart3" },
    ],
    capabilities: [
      "Manage users (create, update, view)",
      "Assign roles to users (except super admin)",
      "View and modify permissions",
      "Full property management",
      "Manage all leases",
      "View all financial records",
      "Access analytics and reports",
      "View user activity logs",
      "Manage maintenance requests",
    ],
    restrictions: [
      "Cannot access system settings",
      "Cannot assign super admin role",
      "Cannot delete super admins",
    ],
  },
  manager: {
    title: "Manager",
    description: "Property and operations management",
    color: "bg-blue-500",
    icon: Building2,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Properties", icon: "Building2" },
      { name: "Maintenance", icon: "Wrench" },
      { name: "Leases", icon: "FileText" },
      { name: "Messages", icon: "MessageSquare" },
      { name: "Financials", icon: "DollarSign" },
    ],
    capabilities: [
      "Manage all properties",
      "Create and update leases",
      "Assign maintenance requests",
      "View and update maintenance status",
      "View financial records",
      "Communicate with tenants and staff",
      "Access property analytics",
    ],
    restrictions: [
      "Cannot manage users or roles",
      "Cannot manage permissions",
      "Cannot create financial records",
      "Cannot access system analytics",
      "Cannot view activity logs",
    ],
  },
  sales_agent: {
    title: "Sales Agent",
    description: "Client relationship and property sales management",
    color: "bg-green-500",
    icon: UserCog,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Properties", icon: "Building2" },
      { name: "Clients", icon: "UserCog" },
      { name: "Messages", icon: "MessageSquare" },
    ],
    capabilities: [
      "View active and available properties",
      "Manage assigned clients",
      "Create and track client interactions",
      "Schedule property showings",
      "Communicate with clients",
      "View property details and media",
    ],
    restrictions: [
      "Cannot edit properties",
      "Cannot access leases",
      "Cannot view financials",
      "Cannot manage maintenance",
      "Cannot view analytics",
    ],
  },
  property_owner: {
    title: "Property Owner",
    description: "Owner of properties with financial oversight",
    color: "bg-purple-500",
    icon: Building2,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "My Properties", icon: "Building2" },
      { name: "Financials", icon: "DollarSign" },
      { name: "Messages", icon: "MessageSquare" },
    ],
    capabilities: [
      "View and manage owned properties",
      "View property analytics",
      "View financial records for owned properties",
      "View leases on owned properties",
      "Communicate with property managers",
      "Upload property media",
    ],
    restrictions: [
      "Cannot manage other properties",
      "Cannot manage users",
      "Cannot create leases",
      "Cannot manage maintenance",
      "Limited to owned properties only",
    ],
  },
  tenant: {
    title: "Tenant",
    description: "Renting tenant with maintenance request capabilities",
    color: "bg-orange-500",
    icon: Users,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "My Lease", icon: "FileText" },
      { name: "Maintenance", icon: "Wrench" },
      { name: "Messages", icon: "MessageSquare" },
    ],
    capabilities: [
      "View own lease details",
      "View lease documents",
      "Submit maintenance requests",
      "View own maintenance requests",
      "Upload maintenance photos",
      "Communicate with property managers",
    ],
    restrictions: [
      "Cannot view other tenants' information",
      "Cannot edit lease details",
      "Cannot view properties",
      "Cannot view financials",
      "Cannot manage other requests",
    ],
  },
  support_staff: {
    title: "Support Staff",
    description: "Maintenance and support operations",
    color: "bg-yellow-600",
    icon: Wrench,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Maintenance", icon: "Wrench" },
      { name: "Messages", icon: "MessageSquare" },
    ],
    capabilities: [
      "View all maintenance requests",
      "Update maintenance status",
      "Add notes to requests",
      "Upload completion photos",
      "Communicate with tenants",
      "View assigned requests",
    ],
    restrictions: [
      "Cannot access properties",
      "Cannot view leases",
      "Cannot view financials",
      "Cannot manage users",
      "Cannot create maintenance requests",
    ],
  },
  accountant: {
    title: "Accountant",
    description: "Financial records and analytics access",
    color: "bg-emerald-600",
    icon: DollarSign,
    navigation: [
      { name: "Dashboard", icon: "LayoutDashboard" },
      { name: "Financials", icon: "DollarSign" },
      { name: "Analytics", icon: "BarChart3" },
    ],
    capabilities: [
      "View all financial records",
      "Create and manage financial records",
      "Export financial reports",
      "View financial analytics",
      "Track income and expenses",
      "Generate financial summaries",
    ],
    restrictions: [
      "Cannot manage properties",
      "Cannot manage users",
      "Cannot manage leases",
      "Cannot manage maintenance",
      "Read-only access to properties",
    ],
  },
};

export default function RoleWorkflows() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Workflows"
        description="Complete documentation of user roles and their capabilities"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Role Workflows" },
        ]}
      />

      <Tabs defaultValue="super_admin" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
          {Object.entries(roleData).map(([key, role]) => (
            <TabsTrigger 
              key={key} 
              value={key}
              className="data-[state=active]:bg-sidebar-active-bg data-[state=active]:text-sidebar-active-text"
            >
              <role.icon className="mr-2 h-4 w-4" />
              {role.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(roleData).map(([key, role]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card className="border-l-4" style={{ borderLeftColor: `var(--${role.color})` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${role.color} text-white`}>
                        <role.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{role.title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {key}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Navigation Access */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Navigation Access
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {role.navigation.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Capabilities & Permissions
                  </h3>
                  <div className="grid gap-2">
                    {role.capabilities.map((capability, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restrictions */}
                {role.restrictions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-destructive" />
                      Restrictions
                    </h3>
                    <div className="grid gap-2">
                      {role.restrictions.map((restriction, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                        >
                          <span className="text-destructive text-xl flex-shrink-0">×</span>
                          <span className="text-sm text-destructive">{restriction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy Summary</CardTitle>
          <CardDescription>
            Understanding the permission levels from highest to lowest access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Badge className="bg-destructive">Highest</Badge>
              <span className="font-medium">Super Admin</span>
              <span className="text-sm text-muted-foreground">→ Full system control</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Badge className="bg-primary">High</Badge>
              <span className="font-medium">Admin</span>
              <span className="text-sm text-muted-foreground">→ User & data management</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Badge className="bg-blue-500">Medium</Badge>
              <span className="font-medium">Manager, Accountant</span>
              <span className="text-sm text-muted-foreground">→ Specialized management</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Badge className="bg-green-500">Standard</Badge>
              <span className="font-medium">Sales Agent, Property Owner</span>
              <span className="text-sm text-muted-foreground">→ Limited management</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Badge variant="secondary">Basic</Badge>
              <span className="font-medium">Tenant, Support Staff</span>
              <span className="text-sm text-muted-foreground">→ Task-specific access</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
