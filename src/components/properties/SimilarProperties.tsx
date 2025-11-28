import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";

interface SimilarPropertiesProps {
  currentPropertyId: string;
  propertyType: string;
  city: string;
}

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_media: Array<{ media_url: string }>;
}

const SimilarProperties = ({ currentPropertyId, propertyType, city }: SimilarPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProperties();
  }, [currentPropertyId, propertyType, city]);

  const fetchSimilarProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_media(media_url)")
        .eq("status", "active")
        .eq("property_type", propertyType)
        .neq("id", currentPropertyId)
        .limit(3);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching similar properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading || properties.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property.id} to={`/properties/${property.id}`}>
            <Card className="overflow-hidden hover:shadow-elegant transition-smooth group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.property_media[0]?.media_url || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-smooth line-clamp-1">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.city}, {property.state}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {property.property_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{property.square_feet}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
