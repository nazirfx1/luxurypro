import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TotalIncomeWidget } from "@/components/dashboard/widgets/TotalIncomeWidget";
import { TotalExpensesWidget } from "@/components/dashboard/widgets/TotalExpensesWidget";
import { ProfitWidget } from "@/components/dashboard/widgets/ProfitWidget";
import { OutstandingPaymentsWidget } from "@/components/dashboard/widgets/OutstandingPaymentsWidget";
import { MonthlyIncomeChartWidget } from "@/components/dashboard/widgets/MonthlyIncomeChartWidget";
import { ExpenseBreakdownWidget } from "@/components/dashboard/widgets/ExpenseBreakdownWidget";
import { ProfitTrendWidget } from "@/components/dashboard/widgets/ProfitTrendWidget";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountantDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Accountant Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Financial tracking and reporting
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/dashboard/financials")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
            <Button onClick={() => navigate("/dashboard/financials")} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Top Stats Row */}
          <TotalIncomeWidget />
          <TotalExpensesWidget />
          <ProfitWidget />
          <OutstandingPaymentsWidget />
          
          {/* Charts Row */}
          <div className="lg:col-span-2 row-span-2">
            <MonthlyIncomeChartWidget />
          </div>
          <div className="lg:col-span-2 row-span-2">
            <ExpenseBreakdownWidget />
          </div>
          
          {/* Profit Trend */}
          <div className="lg:col-span-4">
            <ProfitTrendWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountantDashboard;
