import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PropertiesList from "./pages/properties/PropertiesList";
import PropertyForm from "./pages/properties/PropertyForm";
import PropertyDetail from "./pages/properties/PropertyDetail";
import FinancialDashboard from "./pages/financials/FinancialDashboard";
import CapRateCalculator from "./pages/financials/CapRateCalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties"
              element={
                <ProtectedRoute>
                  <PropertiesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties/new"
              element={
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties/:id"
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/properties/:id/edit"
              element={
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/financials"
              element={
                <ProtectedRoute>
                  <FinancialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/financials/calculator"
              element={
                <ProtectedRoute>
                  <CapRateCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lease"
              element={
                <ProtectedRoute>
                  {React.createElement(React.lazy(() => import("./pages/leases/MyLease")))}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/maintenance"
              element={
                <ProtectedRoute>
                  {React.createElement(React.lazy(() => import("./pages/maintenance/MaintenanceRequests")))}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/maintenance/new"
              element={
                <ProtectedRoute>
                  {React.createElement(React.lazy(() => import("./pages/maintenance/NewMaintenanceRequest")))}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <ProtectedRoute>
                  {React.createElement(React.lazy(() => import("./pages/messages/Messages")))}
                </ProtectedRoute>
              }
            />
            <Route path="/setup-admin" element={React.createElement(React.lazy(() => import("./pages/admin/SetupAdmin")))} />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  {React.createElement(React.lazy(() => import("./pages/admin/UserManagement")))}
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
