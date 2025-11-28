import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const TaskPerformanceWidget = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Performance</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Rate</span>
            <span className="font-medium">85%</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
