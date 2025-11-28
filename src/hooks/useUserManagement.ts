import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

export interface UserWithRoles extends Profile {
  user_roles: UserRole[];
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("profiles")
        .select(`
          *,
          user_roles (*)
        `)
        .is("deleted_at", null);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      let filteredData = data as UserWithRoles[];

      // Apply role filter
      if (roleFilter !== "all") {
        filteredData = filteredData.filter(user =>
          user.user_roles.some(ur => ur.role === roleFilter)
        );
      }

      // Apply search filter
      if (searchQuery) {
        filteredData = filteredData.filter(user =>
          user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setUsers(filteredData);
    } catch (error: any) {
      toast.error("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel("users-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadUsers)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, loadUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchQuery, statusFilter, roleFilter]);

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", userId);

      if (error) throw error;

      // Log activity
      await logActivity("update_user_status", "user", userId, { status });

      toast.success(`User ${status === "active" ? "activated" : status === "inactive" ? "deactivated" : "suspended"} successfully`);
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to update user status: " + error.message);
    }
  };

  const softDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;

      await logActivity("soft_delete_user", "user", userId);

      toast.success("User deleted successfully");
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to delete user: " + error.message);
    }
  };

  const restoreUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: null })
        .eq("id", userId);

      if (error) throw error;

      await logActivity("restore_user", "user", userId);

      toast.success("User restored successfully");
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to restore user: " + error.message);
    }
  };

  const updateUserDetails = async (userId: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      await logActivity("update_user", "user", userId, updates);

      toast.success("User updated successfully");
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to update user: " + error.message);
    }
  };

  const assignRole = async (userId: string, role: any) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ 
          user_id: userId, 
          role: role as any
        });

      if (error) throw error;

      await logActivity("assign_role", "user", userId, { role });

      toast.success("Role assigned successfully");
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to assign role: " + error.message);
    }
  };

  const removeRole = async (userId: string, role: any) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as any);

      if (error) throw error;

      await logActivity("remove_role", "user", userId, { role });

      toast.success("Role removed successfully");
      loadUsers();
    } catch (error: any) {
      toast.error("Failed to remove role: " + error.message);
    }
  };

  const logActivity = async (action: string, entityType: string, entityId: string, details?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: details || {}
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  return {
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
    updateUserDetails,
    assignRole,
    removeRole,
    refresh: loadUsers
  };
};
