import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Building2, DollarSign, Bed, Bath, TrendingUp, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type UserRole = "super_admin" | "admin" | "manager" | "sales_agent" | "property_owner" | "tenant" | "support_staff" | "accountant";

const statusColors = {
  draft: "bg-gray-500",
  active: "bg-green-500",
  under_offer: "bg-yellow-500",
  under_review: "bg-blue-500",
  sold: "bg-purple-500",
  leased: "bg-indigo-500",
};

const PropertiesList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    loadUserRole();
    loadProperties();

    // Realtime subscription for properties
    const channel = supabase
      .channel("properties-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => loadProperties()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUserRole = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .order("assigned_at", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error("Error loading user role:", error);
      return;
    }

    setUserRole(data?.role as UserRole);
  };

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_media!property_media_property_id_fkey(media_url, media_type, display_order),
          profiles!properties_created_by_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error("Failed to load properties");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
  });

  // Analytics
  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = properties.length > 0 ? totalValue / properties.length : 0;
  const statusDist = ["draft", "active", "under_offer", "sold", "leased"].map((status) => ({
    name: status.replace("_", " "),
    value: properties.filter((p) => p.status === status).length,
  })).filter((s) => s.value > 0);

  const CHART_COLORS = ["#6b7280", "hsl(var(--primary))", "#f59e0b", "#8b5cf6", "#06b6d4"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFirstImage = (media: any[]) => {
    if (!media || media.length === 0) return null;
    const sortedMedia = [...media].sort((a, b) => a.display_order - b.display_order);
    return sortedMedia[0]?.media_url;
  };

  // Role-based permission checks
  const canCreateProperty = () => {
    return ["super_admin", "admin", "manager", "property_owner"].includes(userRole || "");
  };

  const canEditProperty = (property: any) => {
    if (["super_admin", "admin"].includes(userRole || "")) return true;
    if (userRole === "manager") return true;
    if (userRole === "property_owner") {
      return property.owner_id === user?.id || property.created_by === user?.id;
    }
    return false;
  };

  const canDeleteProperty = (property: any) => {
    if (userRole === "super_admin") return true;
    if (userRole === "admin" && property.created_by !== user?.id) return false;
    if (userRole === "property_owner") {
      return property.owner_id === user?.id || property.created_by === user?.id;
    }
    return false;
  };

  const canViewFinancials = () => {
    return ["super_admin", "admin", "manager", "accountant", "property_owner"].includes(userRole || "");
  };

  const getPageTitle = () => {
    switch (userRole) {
      case "sales_agent": return "Available Properties";
      case "property_owner": return "My Properties";
      case "tenant": return "My Property";
      case "support_staff": return "Properties with Maintenance";
      case "accountant": return "Properties Financial Overview";
      default: return "Properties";
    }
  };

  const getPageDescription = () => {
    switch (userRole) {
      case "sales_agent": return "Browse available properties for your clients";
      case "property_owner": return "Manage your property portfolio";
      case "tenant": return "View your leased property details";
      case "support_staff": return "Properties requiring your maintenance attention";
      case "accountant": return "Financial metrics and reports for properties";
      default: return "Manage your property portfolio";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
            <p className="text-muted-foreground mt-1">{getPageDescription()}</p>
          </div>
          {canCreateProperty() && (
            <Button onClick={() => navigate("/dashboard/properties/new")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under_offer">Under Offer</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="leased">Leased</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Latest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            {canViewFinancials() && (
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Button>
            )}
          </div>
        </Card>

        {/* Analytics Dashboard */}
        {showAnalytics && canViewFinancials() && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Properties</h3>
              <p className="text-3xl font-bold text-primary">{properties.length}</p>
              <p className="text-sm text-muted-foreground mt-1">In portfolio</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Portfolio Value</h3>
              <p className="text-3xl font-bold text-green-600">${(totalValue / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-muted-foreground mt-1">Total market value</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Price</h3>
              <p className="text-3xl font-bold text-blue-600">${(avgPrice / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground mt-1">Per property</p>
            </Card>
            <Card className="p-6 md:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Property Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Export Section */}
        {["super_admin", "admin", "manager", "accountant"].includes(userRole || "") && (
          <div className="flex justify-end">
            <ExportMenu data={filteredProperties} filename="properties" />
          </div>
        )}

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first property"}
            </p>
            <Button onClick={() => navigate("/dashboard/properties/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-elegant transition-all group"
              >
                {/* Image */}
                <div 
                  className="relative h-48 bg-muted overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                >
                  {getFirstImage(property.property_media) ? (
                    <img
                      src={getFirstImage(property.property_media)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-3 right-3 ${
                      statusColors[property.status as keyof typeof statusColors]
                    } text-white`}
                  >
                    {property.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{property.address}</p>
                  </div>

                  {(userRole !== "support_staff" && userRole !== "tenant") && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <DollarSign className="w-5 h-5" />
                        {formatPrice(property.price)}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms}
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms}
                      </div>
                    )}
                    {property.square_feet && (
                      <div className="text-xs">{property.square_feet.toLocaleString()} sq ft</div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground capitalize">
                      {property.property_type} • {property.listing_type}
                    </p>
                  </div>

                  {/* Role-based action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    
                    {canEditProperty(property) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/properties/edit/${property.id}`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                    
                    {canDeleteProperty(property) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this property?")) {
                            const { error } = await supabase
                              .from("properties")
                              .delete()
                              .eq("id", property.id);
                            
                            if (error) {
                              toast.error("Failed to delete property");
                            } else {
                              toast.success("Property deleted successfully");
                              loadProperties();
                            }
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertiesList;
