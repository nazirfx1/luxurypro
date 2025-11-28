import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Wrench, DollarSign } from "lucide-react";
import { MyLeaseWidget } from "@/components/dashboard/widgets/MyLeaseWidget";
import { MyMaintenanceWidget } from "@/components/dashboard/widgets/MyMaintenanceWidget";
import { RentDueWidget } from "@/components/dashboard/widgets/RentDueWidget";
import { TenantMessagesWidget } from "@/components/dashboard/widgets/TenantMessagesWidget";

const TenantDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Tenant Dashboard</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Manage your lease, payments, and maintenance requests
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                My Lease
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">Active</div>
              <p className="text-xs text-muted-foreground">Expires 8mo</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Rent Due
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">$1,200</div>
              <p className="text-xs text-muted-foreground">Due in 5 days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Maintenance
              </CardTitle>
              <Wrench className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-muted-foreground">Active requests</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                My Property
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">Unit 204</div>
              <p className="text-xs text-muted-foreground">Luxury Apts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid gap-3 md:gap-6 md:grid-cols-2">
          <MyLeaseWidget />
          <RentDueWidget />
        </div>

        <div className="grid gap-3 md:gap-6 md:grid-cols-2">
          <MyMaintenanceWidget />
          <TenantMessagesWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboardPage;
