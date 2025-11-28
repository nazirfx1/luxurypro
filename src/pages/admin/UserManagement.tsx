import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, TrendingUp } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserManagementTable } from "@/components/admin/users/UserManagementTable";
import { UserAnalyticsDashboard } from "@/components/admin/users/UserAnalyticsDashboard";
import { RoleManagementDialog } from "@/components/admin/users/RoleManagementDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { Constants } from "@/integrations/supabase/types";

const UserManagement = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const {
    users,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    updateUserStatus,
    softDeleteUser,
    restoreUser,
    assignRole,
    removeRole,
  } = useUserManagement();

  const handleManageRoles = (user: any) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const exportData = users.map((user) => ({
    Name: user.full_name,
    Email: user.email,
    Department: user.department || "N/A",
    Roles: user.user_roles.map((ur: any) => ur.role).join(", "),
    Status: user.status || "active",
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Complete user administration, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {showAnalytics ? "Hide" : "Show"} Analytics
            </Button>
            <ExportMenu data={exportData} filename="users" />
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && <UserAnalyticsDashboard />}

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Constants.public.Enums.app_role.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <UserManagementTable
            users={users}
            onUpdateStatus={updateUserStatus}
            onDelete={softDeleteUser}
            onRestore={restoreUser}
            onEdit={(user) => {
              // TODO: Implement edit dialog
              console.log("Edit user:", user);
            }}
            onManageRoles={handleManageRoles}
          />
        )}

        {/* Role Management Dialog */}
        <RoleManagementDialog
          user={selectedUser}
          open={roleDialogOpen}
          onClose={() => {
            setRoleDialogOpen(false);
            setSelectedUser(null);
          }}
          onAssignRole={assignRole}
          onRemoveRole={removeRole}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
