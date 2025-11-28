import { LucideIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModernSidebarItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isCollapsed?: boolean;
}

export const ModernSidebarItem = ({
  title,
  url,
  icon: Icon,
  isCollapsed = false,
}: ModernSidebarItemProps) => {
  const linkContent = (
    <NavLink
      to={url}
      end
      className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-hover/10 hover:text-sidebar-hover transition-all duration-200 rounded-lg mx-2 group"
      activeClassName="bg-sidebar-active/20 text-sidebar-active-foreground relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-8 after:bg-sidebar-active after:rounded-r-full shadow-[0_0_15px_rgba(201,164,0,0.15)]"
    >
      <Icon className={cn("h-5 w-5 stroke-[1.5]", !isCollapsed && "mr-3")} />
      {!isCollapsed && (
        <span className="font-medium text-sm">{title}</span>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};
