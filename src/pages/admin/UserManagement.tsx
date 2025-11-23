import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, UserPlus, Edit, Trash2, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

type AppRole = "super_admin" | "admin" | "manager" | "sales_agent" | "property_owner" | "tenant" | "support_staff" | "accountant";

type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string | null;
};

type UserWithRoles = Profile & {
  roles: AppRole[];
};

const AVAILABLE_ROLES: AppRole[] = [
  "super_admin",
  "admin",
  "manager",
  "sales_agent",
  "property_owner",
  "tenant",
  "support_staff",
  "accountant",
];

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);

  // Load users with their roles
  const loadUsers = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        ...profile,
        roles: (userRoles || [])
          .filter((role) => role.user_id === profile.id)
          .map((role) => role.role),
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    // Real-time subscriptions
    const profilesChannel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          loadUsers();
        }
      )
      .subscribe();

    const rolesChannel = supabase
      .channel("user-roles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_roles",
        },
        () => {
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open edit dialog
  const handleEditUser = (user: UserWithRoles) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
    });
    setSelectedRoles(user.roles);
    setEditDialogOpen(true);
  };

  // Save user changes
  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editFormData.full_name,
          phone: editFormData.phone || null,
        })
        .eq("id", selectedUser.id);

      if (profileError) throw profileError;

      // Get current roles
      const { data: currentRoles, error: fetchError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", selectedUser.id);

      if (fetchError) throw fetchError;

      const currentRoleNames = currentRoles?.map((r) => r.role) || [];

      // Roles to add
      const rolesToAdd = selectedRoles.filter(
        (role) => !currentRoleNames.includes(role)
      );

      // Roles to remove
      const rolesToRemove = currentRoleNames.filter(
        (role) => !selectedRoles.includes(role)
      );

      // Add new roles
      if (rolesToAdd.length > 0) {
        const { error: addError } = await supabase.from("user_roles").insert(
          rolesToAdd.map((role) => ({
            user_id: selectedUser.id,
            role: role,
            assigned_by: user?.id,
          }))
        );

        if (addError) throw addError;
      }

      // Remove old roles
      if (rolesToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.id)
          .in("role", rolesToRemove);

        if (removeError) throw removeError;
      }

      toast.success("User updated successfully");
      setEditDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  // Toggle role selection
  const toggleRole = (role: AppRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "super_admin" || role === "admin") return "default";
    if (role === "manager") return "secondary";
    return "outline";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="User Management"
        description="Manage users and their roles across the system"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "User Management" },
        ]}
      />

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role} variant={getRoleBadgeVariant(role)}>
                            {role.replace("_", " ")}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and manage roles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Info */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={editFormData.full_name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, full_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editFormData.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
              />
            </div>

            {/* Role Management */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Roles
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={selectedRoles.includes(role) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleRole(role)}
                    className="justify-start"
                  >
                    {role.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
