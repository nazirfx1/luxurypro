import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ClientsList = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Clients"
        description="Manage your clients and leads"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No clients found. Add your first client to get started.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ClientsList;
