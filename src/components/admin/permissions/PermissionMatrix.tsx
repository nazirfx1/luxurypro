import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Constants } from "@/integrations/supabase/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Permission = Tables<"permissions">;

interface PermissionMatrixProps {
  permissions: Permission[];
  hasPermission: (role: string, permissionId: string) => boolean;
  onTogglePermission: (role: string, permissionId: string) => void;
  onDeletePermission: (permissionId: string) => void;
}

const ROLES = Constants.public.Enums.app_role;

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 dark:bg-purple-900",
  admin: "bg-blue-100 dark:bg-blue-900",
  manager: "bg-green-100 dark:bg-green-900",
  sales_agent: "bg-yellow-100 dark:bg-yellow-900",
  property_owner: "bg-orange-100 dark:bg-orange-900",
  tenant: "bg-pink-100 dark:bg-pink-900",
  support_staff: "bg-cyan-100 dark:bg-cyan-900",
  accountant: "bg-indigo-100 dark:bg-indigo-900",
};

export const PermissionMatrix = ({
  permissions,
  hasPermission,
  onTogglePermission,
  onDeletePermission,
}: PermissionMatrixProps) => {
  const [deletePermission, setDeletePermission] = useState<Permission | null>(null);

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
          <div key={module} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{module}</h3>
              <Badge variant="outline">{modulePermissions.length} permissions</Badge>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Permission</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    {ROLES.map((role) => (
                      <TableHead key={role} className="text-center min-w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium">
                            {role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modulePermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {permission.name}
                          </code>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Action: {permission.action}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {permission.description}
                      </TableCell>
                      {ROLES.map((role) => (
                        <TableCell key={role} className="text-center">
                          <div className={`flex items-center justify-center p-2 rounded ${ROLE_COLORS[role]}`}>
                            <Checkbox
                              checked={hasPermission(role, permission.id)}
                              onCheckedChange={() =>
                                onTogglePermission(role, permission.id)
                              }
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletePermission(permission)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}

        <AlertDialog
          open={!!deletePermission}
          onOpenChange={() => setDeletePermission(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Permission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the permission "
                {deletePermission?.name}"? This will remove it from all roles
                that currently have it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deletePermission) {
                    onDeletePermission(deletePermission.id);
                    setDeletePermission(null);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};
