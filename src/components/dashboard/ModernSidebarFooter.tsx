import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ModernSidebarFooterProps {
  isCollapsed?: boolean;
}

export const ModernSidebarFooter = ({ isCollapsed = false }: ModernSidebarFooterProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const userInitials = user?.email
    ?.split("@")[0]
    .substring(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="border-t border-sidebar-border p-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full outline-none">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover/10 transition-all duration-200 cursor-pointer",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Avatar className="h-9 w-9 border-2 border-sidebar-border">
              <AvatarFallback className="bg-sidebar-active text-sidebar-active-foreground text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align={isCollapsed ? "center" : "start"}
          className="w-56 bg-sidebar-background border-sidebar-border"
        >
          <DropdownMenuItem
            onClick={() => navigate("/dashboard/settings")}
            className="cursor-pointer text-sidebar-foreground hover:bg-sidebar-hover/10 hover:text-sidebar-hover"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/dashboard/settings")}
            className="cursor-pointer text-sidebar-foreground hover:bg-sidebar-hover/10 hover:text-sidebar-hover"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-sidebar-border" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
