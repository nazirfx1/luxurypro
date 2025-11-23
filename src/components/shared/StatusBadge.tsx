import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  // Lease statuses
  active: { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Active" },
  expired: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Expired" },
  terminated: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: "Terminated" },
  
  // Maintenance statuses
  pending: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  in_progress: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "In Progress" },
  completed: { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Completed" },
  cancelled: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: "Cancelled" },
  
  // Priority
  low: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: "Low" },
  medium: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Medium" },
  high: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", label: "High" },
  urgent: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Urgent" },
  
  // Property statuses
  draft: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: "Draft" },
  under_offer: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Under Offer" },
  sold: { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Sold" },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status.toLowerCase()] || { 
    color: "bg-muted text-muted-foreground border-border", 
    label: status 
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};
