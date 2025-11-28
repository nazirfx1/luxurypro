import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserWithRoles } from "@/hooks/useUserManagement";
import { Shield, Plus, X } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";

interface RoleManagementDialogProps {
  user: UserWithRoles | null;
  open: boolean;
  onClose: () => void;
  onAssignRole: (userId: string, role: string) => void;
  onRemoveRole: (userId: string, role: string) => void;
}

const AVAILABLE_ROLES = Constants.public.Enums.app_role;

const ROLE_DESCRIPTIONS: Record<string, string> = {
  super_admin: "Full system access with all permissions",
  admin: "Administrative access with user and content management",
  manager: "Manage properties, leases, and maintenance",
  sales_agent: "Handle client interactions and property listings",
  property_owner: "View and manage owned properties",
  tenant: "Access lease information and maintenance requests",
  support_staff: "Provide customer support and assistance",
  accountant: "Access financial records and reports",
};

export const RoleManagementDialog = ({
  user,
  open,
  onClose,
  onAssignRole,
  onRemoveRole,
}: RoleManagementDialogProps) => {
  if (!user) return null;

  const currentRoles = user.user_roles.map((ur) => ur.role as string);

  const handleToggleRole = (role: any) => {
    if (currentRoles.includes(role)) {
      onRemoveRole(user.id, role);
    } else {
      onAssignRole(user.id, role);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Roles for {user.full_name}
          </DialogTitle>
          <DialogDescription>
            Assign or remove roles for this user. Each role has different permissions and access levels.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Roles */}
          <div>
            <Label className="text-sm font-medium">Current Roles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRoles.length === 0 ? (
                <span className="text-sm text-muted-foreground">No roles assigned</span>
              ) : (
                currentRoles.map((role) => (
                  <Badge key={role} variant="default">
                    {role.replace("_", " ")}
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Available Roles */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Available Roles</Label>
            <div className="space-y-3">
              {AVAILABLE_ROLES.map((role) => (
                <div
                  key={role}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`role-${role}`}
                    checked={currentRoles.includes(role)}
                    onCheckedChange={() => handleToggleRole(role)}
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`role-${role}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[role] || "No description available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
