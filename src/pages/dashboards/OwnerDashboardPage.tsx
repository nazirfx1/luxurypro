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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Property Owner Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your properties, tenants, and earnings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Properties
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">Total properties</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tenants
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">28</div>
              <p className="text-xs text-muted-foreground">Across all properties</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$24,600</div>
              <p className="text-xs text-muted-foreground">From rent payments</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$2.4M</div>
              <p className="text-xs text-muted-foreground">Total value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid gap-6 md:grid-cols-2">
          <MyPropertiesWidget />
          <MyEarningsWidget />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MyLeasesWidget />
          <MyMaintenanceRequestsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboardPage;
