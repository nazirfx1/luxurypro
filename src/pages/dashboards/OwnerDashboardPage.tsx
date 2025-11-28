import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import { MyPropertiesWidget } from "@/components/dashboard/widgets/MyPropertiesWidget";
import { MyEarningsWidget } from "@/components/dashboard/widgets/MyEarningsWidget";
import { MyLeasesWidget } from "@/components/dashboard/widgets/MyLeasesWidget";
import { MyMaintenanceRequestsWidget } from "@/components/dashboard/widgets/MyMaintenanceRequestsWidget";

const OwnerDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Property Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Manage your properties, tenants, and earnings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Properties
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">Total props</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Tenants
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">28</div>
              <p className="text-xs text-muted-foreground">All properties</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">$24.6K</div>
              <p className="text-xs text-muted-foreground">Monthly rent</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-xl md:text-2xl font-bold text-foreground">$2.4M</div>
              <p className="text-xs text-muted-foreground">Total value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid gap-3 md:gap-6 md:grid-cols-2">
          <MyPropertiesWidget />
          <MyEarningsWidget />
        </div>

        <div className="grid gap-3 md:gap-6 md:grid-cols-2">
          <MyLeasesWidget />
          <MyMaintenanceRequestsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboardPage;
