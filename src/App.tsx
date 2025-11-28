import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import SalesAgentDashboard from "./pages/dashboards/SalesAgentDashboard";
import PropertyOwnerDashboard from "./pages/dashboards/PropertyOwnerDashboard";
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import SupportStaffDashboard from "./pages/dashboards/SupportStaffDashboard";
import AccountantDashboard from "./pages/dashboards/AccountantDashboard";
import PropertiesList from "./pages/properties/PropertiesList";
import PropertiesListPublic from "./pages/properties/PropertiesListPublic";
import PropertyForm from "./pages/properties/PropertyForm";
import PropertyDetail from "./pages/properties/PropertyDetail";
import PropertyDetailPublic from "./pages/properties/PropertyDetailPublic";
import Favorites from "./pages/properties/Favorites";
import FinancialDashboard from "./pages/financials/FinancialDashboard";
import CapRateCalculator from "./pages/financials/CapRateCalculator";
import NotFound from "./pages/NotFound";
import SetupAdminModern from "./pages/admin/SetupAdminModern";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import ClientsList from "./pages/clients/ClientsList";
import LeasesList from "./pages/leases/LeasesList";
import UserManagement from "./pages/admin/UserManagement";
import PermissionManagement from "./pages/admin/PermissionManagement";
import RoleWorkflows from "./pages/admin/RoleWorkflows";
import MyLease from "./pages/leases/MyLease";
import MaintenanceRequests from "./pages/maintenance/MaintenanceRequests";
import NewMaintenanceRequest from "./pages/maintenance/NewMaintenanceRequest";
import Messages from "./pages/messages/Messages";

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
            <Route path="/properties" element={<PropertiesListPublic />} />
            <Route path="/properties/:id" element={<PropertyDetailPublic />} />
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
              path="/dashboard/super-admin"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manager"
              element={
                <ProtectedRoute>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/sales-agent"
              element={
                <ProtectedRoute>
                  <SalesAgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/property-owner"
              element={
                <ProtectedRoute>
                  <PropertyOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tenant"
              element={
                <ProtectedRoute>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/support-staff"
              element={
                <ProtectedRoute>
                  <SupportStaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/accountant"
              element={
                <ProtectedRoute>
                  <AccountantDashboard />
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
              path="/dashboard/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
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
              path="/dashboard/my-lease"
              element={
                <ProtectedRoute>
                  <MyLease />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lease"
              element={
                <ProtectedRoute>
                  <MyLease />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenanceRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/maintenance/new"
              element={
                <ProtectedRoute>
                  <NewMaintenanceRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route path="/setup-admin" element={<SetupAdminModern />} />
            <Route
              path="/dashboard/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/permission-management"
              element={
                <ProtectedRoute>
                  <PermissionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/permissions"
              element={
                <ProtectedRoute>
                  <PermissionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/role-workflows"
              element={
                <ProtectedRoute>
                  <RoleWorkflows />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/clients"
              element={
                <ProtectedRoute>
                  <ClientsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/leases"
              element={
                <ProtectedRoute>
                  <LeasesList />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
