import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Shield, Lock } from "lucide-react";
import { usePermissionManagement } from "@/hooks/usePermissionManagement";
import { PermissionMatrix } from "@/components/admin/permissions/PermissionMatrix";
import { CreatePermissionDialog } from "@/components/admin/permissions/CreatePermissionDialog";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { Constants } from "@/integrations/supabase/types";

const PermissionManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    permissions,
    rolePermissions,
    loading,
    groupByModule,
    hasPermission,
    togglePermission,
    createPermission,
    deletePermission,
  } = usePermissionManagement();

  const groupedPermissions = groupByModule(permissions);
  const modules = Object.keys(groupedPermissions);

  // Export data
  const exportData = Constants.public.Enums.app_role.map((role) => {
    const roleData: any = { Role: role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) };
    
    permissions.forEach((perm) => {
      roleData[perm.name] = hasPermission(role, perm.id) ? "✓" : "✗";
    });

    return roleData;
  });

  // Statistics
  const stats = {
    totalPermissions: permissions.length,
    totalModules: modules.length,
    totalRoles: Constants.public.Enums.app_role.length,
    totalAssignments: rolePermissions.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permission Management</h1>
            <p className="text-muted-foreground mt-1">
              Define and assign granular permissions to roles
            </p>
          </div>
          <div className="flex gap-2">
            <ExportMenu data={exportData} filename="permissions-matrix" />
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Permission
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPermissions}</div>
                <p className="text-xs text-muted-foreground">
                  Across {stats.totalModules} modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRoles}</div>
                <p className="text-xs text-muted-foreground">System roles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Modules</CardTitle>
                <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  M
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalModules}</div>
                <p className="text-xs text-muted-foreground">Permission groups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">
                  Permission-role mappings
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Permission Matrix
            </CardTitle>
            <CardDescription>
              Toggle checkboxes to assign or remove permissions from roles. Permissions are
              organized by module for easy management. Each role can have multiple
              permissions across different modules.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Permission Matrix */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <PermissionMatrix
            permissions={permissions}
            hasPermission={hasPermission}
            onTogglePermission={togglePermission}
            onDeletePermission={deletePermission}
          />
        )}

        {/* Create Permission Dialog */}
        <CreatePermissionDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={createPermission}
          existingModules={modules}
        />
      </div>
    </DashboardLayout>
  );
};

export default PermissionManagement;
