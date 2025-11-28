import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LeasesList = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Leases"
        description="Manage all property leases"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No leases found. Create your first lease to get started.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default LeasesList;
