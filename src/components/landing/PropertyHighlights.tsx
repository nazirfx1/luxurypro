import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Heart, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import PropertyFlipCard from "@/components/properties/PropertyFlipCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Property {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  property_type: string | null;
  year_built: number | null;
  listing_type: string | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  property_media: Array<{ media_url: string }>;
}

const PropertyHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    console.log('🚀 PropertyHighlights component mounted');
    
    const fetchProperties = async () => {
      try {
        console.log('🔄 Starting property fetch...');
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from("properties")
          .select(`
            id, 
            title, 
            description, 
            city, 
            state, 
            price, 
            bedrooms, 
            bathrooms, 
            square_feet, 
            property_type, 
            year_built, 
            listing_type,
            is_featured,
            created_at,
            updated_at,
            property_media(media_url)
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(12);

        if (fetchError) {
          console.error('❌ Fetch error:', fetchError);
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        console.log('✅ Raw data received:', data);
        console.log('📊 Number of properties:', data?.length || 0);
        
        if (data) {
          console.log('📝 First property sample:', data[0]);
          setProperties(data as Property[]);
          console.log('✅ State updated with', data.length, 'properties');
        } else {
          console.warn('⚠️ No data returned from query');
          setProperties([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('💥 Exception during fetch:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchProperties();

    // Real-time subscription
    console.log('🔌 Setting up real-time subscriptions...');
    const channel = supabase
      .channel("properties-realtime-channel")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "properties"
        },
        (payload) => {
          console.log('🔔 Real-time event:', payload.eventType, payload);
          fetchProperties();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_media" },
        (payload) => {
          console.log('🔔 Media update:', payload.eventType);
          fetchProperties();
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('📊 State updated - Properties count:', properties.length);
    console.log('⏳ Loading:', loading);
    console.log('❌ Error:', error);
  }, [properties, loading, error]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  console.log('🎨 Rendering PropertyHighlights - Properties:', properties.length, 'Loading:', loading);

  return (
    <section className="py-20 md:py-32 bg-primary relative overflow-hidden" ref={ref}>
      {/* Subtle pattern overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20px 20px, hsl(0 0% 0% / 0.1) 2px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-background"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Featured <motion.span 
              className="text-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >Properties</motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-background/90 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Handpicked luxury properties in prime locations
          </motion.p>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-destructive mb-2">
                Error Loading Properties
              </h3>
              <p className="text-destructive/80 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse bg-background border-background/20">
                <div className="aspect-[4/3] bg-muted/20" />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted/20 rounded w-3/4" />
                    <div className="h-4 bg-muted/20 rounded w-1/2" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted/20 rounded w-16" />
                      <div className="h-4 bg-muted/20 rounded w-16" />
                      <div className="h-4 bg-muted/20 rounded w-16" />
                    </div>
                    <div className="h-8 bg-muted/20 rounded w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-background/20 flex items-center justify-center">
                <HomeIcon className="w-12 h-12 text-background/60" />
              </div>
              <h3 className="text-2xl font-bold text-background mb-3">
                No Properties Available
              </h3>
              <p className="text-background/80 mb-6">
                We're currently updating our listings. Check back soon for amazing properties!
              </p>
              <Link to="/properties">
                <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold">
                  Browse All Listings
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Grid with 3D Flip Cards */}
        {!loading && !error && properties.length > 0 && (
          <>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => {
                console.log(`🏠 Rendering property ${index + 1}:`, property.title);
                return (
                  <PropertyFlipCard
                    key={property.id}
                    property={property}
                    isFavorite={isFavorite(property.id)}
                    onToggleFavorite={toggleFavorite}
                    index={index}
                    badge={property.is_featured ? "Featured" : "New"}
                  />
                );
              })}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {properties.map((property) => {
                    const propertyBadge = property.is_featured ? "Featured" : "New";
                    return (
                      <CarouselItem key={property.id}>
                        <Card className="overflow-hidden border-background/20 bg-background shadow-lg">
                          <div className="relative overflow-hidden aspect-[4/3]">
                            <Link to={`/properties/${property.id}`}>
                              <img 
                                src={property.property_media[0]?.media_url || "/placeholder.svg"} 
                                alt={property.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            </Link>
                            <span className="absolute top-4 left-4 bg-foreground text-background px-3 py-1 rounded-full text-sm font-bold z-10">
                              {propertyBadge}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm hover:bg-background z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(property.id);
                              }}
                            >
                              <Heart 
                                className={`w-5 h-5 transition-all ${
                                  isFavorite(property.id) 
                                    ? 'fill-primary text-primary' 
                                    : 'text-foreground'
                                }`} 
                              />
                            </Button>
                          </div>
                          <CardContent className="p-6 bg-background">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                  {property.title}
                                </h3>
                                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{property.city}, {property.state}</span>
                                </div>
                                {property.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {property.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {property.bedrooms && (
                                  <div className="flex items-center gap-1">
                                    <Bed className="w-4 h-4" />
                                    <span>{property.bedrooms}</span>
                                  </div>
                                )}
                                {property.bathrooms && (
                                  <div className="flex items-center gap-1">
                                    <Bath className="w-4 h-4" />
                                    <span>{property.bathrooms}</span>
                                  </div>
                                )}
                                {property.square_feet && (
                                  <div className="flex items-center gap-1">
                                    <Square className="w-4 h-4" />
                                    <span>{property.square_feet} sqft</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-border">
                                <span className="text-2xl font-bold text-foreground">{formatPrice(property.price)}</span>
                                <Link to={`/properties/${property.id}`}>
                                  <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-bold hover:bg-foreground/90 transition-colors">
                                    View Details
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="bg-background text-foreground border-background/20 hover:bg-background/90" />
                <CarouselNext className="bg-background text-foreground border-background/20 hover:bg-background/90" />
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PropertyHighlights;
