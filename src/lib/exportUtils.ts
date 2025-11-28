// Export utilities for data export functionality

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(","),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Handle nested objects
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value).replace(/,/g, ";");
          }
          // Escape commas and quotes
          const stringValue = String(value || "");
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.json`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDataForExport = (data: any[]) => {
  return data.map(item => {
    const formatted: any = {};
    Object.keys(item).forEach(key => {
      // Skip complex nested objects and arrays
      if (typeof item[key] === "object" && item[key] !== null) {
        if (Array.isArray(item[key])) {
          formatted[key] = item[key].join("; ");
        } else if (item[key].full_name || item[key].title || item[key].name) {
          formatted[key] = item[key].full_name || item[key].title || item[key].name;
        } else {
          formatted[key] = JSON.stringify(item[key]);
        }
      } else {
        formatted[key] = item[key];
      }
    });
    return formatted;
  });
};
