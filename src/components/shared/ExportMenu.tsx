import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson } from "lucide-react";
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/exportUtils";
import { toast } from "sonner";

interface ExportMenuProps {
  data: any[];
  filename: string;
  variant?: "default" | "outline" | "ghost";
}

export const ExportMenu = ({ data, filename, variant = "outline" }: ExportMenuProps) => {
  const handleExport = (format: "csv" | "json") => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const formattedData = formatDataForExport(data);

      if (format === "csv") {
        exportToCSV(formattedData, filename);
        toast.success("Exported to CSV successfully");
      } else {
        exportToJSON(formattedData, filename);
        toast.success("Exported to JSON successfully");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
