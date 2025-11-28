import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  Loader2,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookVisitDialog from "@/components/properties/BookVisitDialog";
import PropertyAmenities from "@/components/properties/PropertyAmenities";
import SimilarProperties from "@/components/properties/SimilarProperties";

const PropertyDetailPublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (id) {
      loadProperty(id);
      if (user) {
        checkFavoriteStatus(id);
      }
    }
  }, [id, user]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_media!property_media_property_id_fkey(*),
          profiles!properties_created_by_fkey(full_name)
        `)
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error: any) {
      toast.error("Failed to load property details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (propertyId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("property_favorites")
        .select("id")
        .eq("property_id", propertyId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      navigate("/auth");
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("property_favorites")
          .delete()
          .eq("property_id", id)
          .eq("user_id", user.id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from("property_favorites")
          .insert({ property_id: id, user_id: user.id });

        if (error) throw error;
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      toast.error("Failed to update favorites");
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

  const nextImage = () => {
    if (property?.property_media) {
      setCurrentImageIndex((prev) => 
        prev === property.property_media.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.property_media) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.property_media.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 mt-20">
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Property not found</h3>
            <Button onClick={() => navigate("/properties")}>Browse Properties</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const sortedImages = property.property_media
    ? [...property.property_media].sort((a: any, b: any) => a.display_order - b.display_order)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/properties")} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite ? "text-primary border-primary" : ""}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        {sortedImages.length > 0 && (
          <div className="mb-8">
            <div className="relative h-[500px] rounded-2xl overflow-hidden group">
              <img
                src={sortedImages[currentImageIndex]?.media_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {sortedImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {sortedImages.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-smooth ${
                      index === currentImageIndex ? "bg-primary w-8" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {sortedImages.slice(0, 4).map((media: any, index: number) => (
                  <button
                    key={media.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-xl overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={media.media_url}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
                <Badge className="bg-primary text-primary-foreground capitalize">
                  {property.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-primary">{formatPrice(property.price)}</h2>
                <Badge variant="outline" className="capitalize">{property.property_type}</Badge>
              </div>

              <div className="flex items-center gap-8 text-muted-foreground mb-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span>Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span>Baths</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5" />
                    <span className="font-semibold">{property.square_feet.toLocaleString()}</span>
                    <span>sqft</span>
                  </div>
                )}
              </div>

              {property.description && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">About this property</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                </>
              )}
            </Card>

            {/* Amenities */}
            <PropertyAmenities features={property.features} />

            {/* Location Map */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Location</h3>
              <div className="space-y-2 text-sm mb-4">
                <p className="font-medium">{property.address}</p>
                <p className="text-muted-foreground">
                  {property.city}, {property.state} {property.zip_code}
                </p>
                <p className="text-muted-foreground">{property.country}</p>
              </div>
              <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Map view</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4 text-lg">Book a Visit</h3>
              <BookVisitDialog propertyId={id!} propertyTitle={property.title} />
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing</span>
                  <span className="font-medium capitalize">{property.listing_type}</span>
                </div>
                {property.year_built && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Built</span>
                    <span className="font-medium">{property.year_built}</span>
                  </div>
                )}
                {property.lot_size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lot Size</span>
                    <span className="font-medium">{property.lot_size.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties 
          currentPropertyId={id!}
          propertyType={property.property_type}
          city={property.city}
        />
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetailPublic;
