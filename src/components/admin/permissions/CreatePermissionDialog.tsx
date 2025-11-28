import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, module: string, action: string) => void;
  existingModules: string[];
}

const ACTIONS = ["create", "read", "update", "delete", "manage", "export"];

export const CreatePermissionDialog = ({
  open,
  onClose,
  onCreate,
  existingModules,
}: CreatePermissionDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    module: "",
    action: "",
    customModule: "",
  });

  const handleSubmit = () => {
    const module = formData.module === "custom" ? formData.customModule : formData.module;
    
    if (!formData.name || !formData.description || !module || !formData.action) {
      return;
    }

    onCreate(formData.name, formData.description, module, formData.action);
    setFormData({
      name: "",
      description: "",
      module: "",
      action: "",
      customModule: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Permission</DialogTitle>
          <DialogDescription>
            Define a new permission that can be assigned to roles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Permission Name *</Label>
            <Input
              id="name"
              placeholder="e.g., reports.export"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Use lowercase with dots (e.g., module.action)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this permission allows"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module *</Label>
            <Select
              value={formData.module}
              onValueChange={(value) => setFormData({ ...formData, module: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {existingModules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Custom Module</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.module === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customModule">Custom Module Name *</Label>
              <Input
                id="customModule"
                placeholder="e.g., Reports"
                value={formData.customModule}
                onChange={(e) =>
                  setFormData({ ...formData, customModule: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="action">Action *</Label>
            <Select
              value={formData.action}
              onValueChange={(value) => setFormData({ ...formData, action: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Permission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
