import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Search, Building2, DollarSign, Bed, Bath } from "lucide-react";
import { toast } from "sonner";

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
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    loadProperties();
  }, []);

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
  });

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Properties</h1>
            <p className="text-muted-foreground mt-1">Manage your property portfolio</p>
          </div>
          <Button onClick={() => navigate("/dashboard/properties/new")} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </div>
        </Card>

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
                className="overflow-hidden hover:shadow-elegant transition-all cursor-pointer group"
                onClick={() => navigate(`/dashboard/properties/${property.id}`)}
              >
                {/* Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                      <DollarSign className="w-5 h-5" />
                      {formatPrice(property.price)}
                    </div>
                  </div>

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
