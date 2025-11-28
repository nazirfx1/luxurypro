import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Plus, Calculator, Filter } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["#D4AF37", "#C19A2E", "#B08A26", "#9F7A1E"];

const FinancialDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [financialsResult, propertiesResult] = await Promise.all([
        supabase.from("financial_records").select("*").order("record_date", { ascending: false }),
        supabase.from("properties").select("id, title"),
      ]);

      if (financialsResult.error) throw financialsResult.error;
      if (propertiesResult.error) throw propertiesResult.error;

      setFinancialData(financialsResult.data || []);
      setProperties(propertiesResult.data || []);
    } catch (error: any) {
      toast.error("Failed to load financial data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = selectedProperty === "all"
    ? financialData
    : financialData.filter((record) => record.property_id === selectedProperty);

  // Calculate KPIs
  const totalRevenue = filteredData
    .filter((r) => r.type === "revenue")
    .reduce((sum, r) => sum + parseFloat(r.amount), 0);

  const totalExpenses = filteredData
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + parseFloat(r.amount), 0);

  const netIncome = totalRevenue - totalExpenses;

  // Prepare chart data
  const monthlyData = filteredData.reduce((acc: any, record) => {
    const month = new Date(record.record_date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = { month, revenue: 0, expenses: 0 };
    }

    if (record.type === "revenue") {
      acc[month].revenue += parseFloat(record.amount);
    } else {
      acc[month].expenses += parseFloat(record.amount);
    }

    return acc;
  }, {});

  const chartData = Object.values(monthlyData).slice(0, 12).reverse();

  // Expense by category
  const expensesByCategory = filteredData
    .filter((r) => r.type === "expense")
    .reduce((acc: any, record) => {
      const category = record.category || "Other";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(record.amount);
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Intelligence</h1>
            <p className="text-muted-foreground mt-1">Track revenue, expenses, and profitability</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/financials/calculator"}>
              <Calculator className="w-4 h-4 mr-2" />
              Cap Rate Calculator
            </Button>
            <ExportMenu data={filteredData} filename="financial-records" />
            <Button onClick={() => window.location.href = "/dashboard/financials/new"}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Property Filter */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-2">All-time income</p>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
              <div className="p-2 rounded-lg bg-red-500/10">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-2">All-time costs</p>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className={`text-3xl font-bold ${netIncome >= 0 ? "text-primary" : "text-red-600"}`}>
              {formatCurrency(netIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {netIncome >= 0 ? "Profit" : "Loss"}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue-expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue-expenses">Revenue vs Expenses</TabsTrigger>
            <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue-expenses" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue & Expenses</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="expense-breakdown" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Distribution by Category</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {filteredData.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{record.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.record_date).toLocaleDateString()}
                  </p>
                  {record.description && (
                    <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      record.type === "revenue" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {record.type === "revenue" ? "+" : "-"}
                    {formatCurrency(parseFloat(record.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{record.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinancialDashboard;
