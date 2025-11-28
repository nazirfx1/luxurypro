import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Permission = Tables<"permissions">;
type RolePermission = Tables<"role_permissions">;

interface PermissionsByModule {
  [module: string]: Permission[];
}

export const usePermissionManagement = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    try {
      setLoading(true);

      const [permissionsRes, rolePermissionsRes] = await Promise.all([
        supabase.from("permissions").select("*").order("module", { ascending: true }),
        supabase.from("role_permissions").select("*"),
      ]);

      if (permissionsRes.error) throw permissionsRes.error;
      if (rolePermissionsRes.error) throw rolePermissionsRes.error;

      setPermissions(permissionsRes.data || []);
      setRolePermissions(rolePermissionsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to load permissions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();

    const channel = supabase
      .channel("permissions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "permissions" }, loadPermissions)
      .on("postgres_changes", { event: "*", schema: "public", table: "role_permissions" }, loadPermissions)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const groupByModule = (perms: Permission[]): PermissionsByModule => {
    return perms.reduce((acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    }, {} as PermissionsByModule);
  };

  const hasPermission = (role: string, permissionId: string): boolean => {
    return rolePermissions.some(
      (rp) => rp.role === role && rp.permission_id === permissionId
    );
  };

  const togglePermission = async (role: any, permissionId: string) => {
    try {
      const exists = hasPermission(role, permissionId);

      if (exists) {
        // Remove permission
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role as any)
          .eq("permission_id", permissionId);

        if (error) throw error;
        toast.success("Permission removed from role");
      } else {
        // Add permission
        const { error } = await supabase
          .from("role_permissions")
          .insert({ role: role as any, permission_id: permissionId });

        if (error) throw error;
        toast.success("Permission assigned to role");
      }

      loadPermissions();
    } catch (error: any) {
      toast.error("Failed to update permission: " + error.message);
    }
  };

  const createPermission = async (
    name: string,
    description: string,
    module: string,
    action: string
  ) => {
    try {
      const { error } = await supabase.from("permissions").insert({
        name,
        description,
        module,
        action,
      });

      if (error) throw error;
      toast.success("Permission created successfully");
      loadPermissions();
    } catch (error: any) {
      toast.error("Failed to create permission: " + error.message);
    }
  };

  const deletePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase
        .from("permissions")
        .delete()
        .eq("id", permissionId);

      if (error) throw error;
      toast.success("Permission deleted successfully");
      loadPermissions();
    } catch (error: any) {
      toast.error("Failed to delete permission: " + error.message);
    }
  };

  return {
    permissions,
    rolePermissions,
    loading,
    groupByModule,
    hasPermission,
    togglePermission,
    createPermission,
    deletePermission,
    refresh: loadPermissions,
  };
};
