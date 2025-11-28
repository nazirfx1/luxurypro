import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const OutstandingPaymentsWidget = () => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$0</div>
        <p className="text-xs text-muted-foreground mt-1">No overdue payments</p>
      </CardContent>
    </Card>
  );
};
