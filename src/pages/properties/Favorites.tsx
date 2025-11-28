import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Maximize, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface FavoriteProperty {
  id: string;
  property_id: string;
  properties: {
    id: string;
    title: string;
    price: number;
    city: string;
    state: string;
    property_type: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    property_media: Array<{ media_url: string }>;
  };
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchFavorites(user.id);
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("property_favorites")
        .select(`
          id,
          property_id,
          properties (
            id,
            title,
            price,
            city,
            state,
            property_type,
            status,
            bedrooms,
            bathrooms,
            square_feet,
            property_media (media_url)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("property_favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter((f) => f.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
      console.error(error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground mt-1">
            Properties you've saved for later
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring and save properties you love
            </p>
            <Button onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const property = favorite.properties;
              return (
                <Card key={favorite.id} className="overflow-hidden group relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
                    onClick={() => removeFavorite(favorite.id)}
                  >
                    <Heart className="w-5 h-5 fill-primary text-primary" />
                  </Button>
                  
                  <Link to={`/properties/${property.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={property.property_media[0]?.media_url || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground capitalize">
                          {property.status}
                        </Badge>
                      </div>
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
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Favorites;
