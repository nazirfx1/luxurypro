import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Home, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { SharePropertyDialog } from "@/components/properties/SharePropertyDialog";
import PropertyFlipCard from "@/components/properties/PropertyFlipCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

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
  property_media: Array<{ media_url: string }>;
}

const LatestProperties = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from("properties")
        .select("id, title, description, city, state, price, bedrooms, bathrooms, square_feet, property_type, year_built, listing_type, property_media(media_url)")
        .eq("status", "active");

      // Apply sorting
      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "price-low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price", { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching properties:", fetchError);
        setError("Failed to load properties. Please try again later.");
        setLoading(false);
        return;
      }

      if (data) {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();

    // Realtime subscription for live updates
    const channel = supabase
      .channel("all-properties-landing")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        (payload) => {
          console.log("Property change detected:", payload);
          fetchProperties();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_media" },
        (payload) => {
          console.log("Property media change detected:", payload);
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              All <span className="text-primary">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground">Loading properties...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full aspect-[4/3]" />
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <Home className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">Error Loading Properties</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Properties Available</h3>
            <p className="text-muted-foreground">Check back soon for new listings!</p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as any
      }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden" ref={ref}>
      {/* Subtle animated mesh gradient */}
      <motion.div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container px-4 relative z-10">
        <motion.div 
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "normal" } : { opacity: 0, letterSpacing: "0.1em" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Latest <motion.span 
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >Properties</motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our handpicked selection of premium properties
          </motion.p>
        </motion.div>

        {/* Sorting Controls */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] border-border bg-background hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Desktop Grid with 3D Flip Cards */}
        <motion.div 
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {properties.map((property, index) => (
            <PropertyFlipCard
              key={property.id}
              property={property}
              isFavorite={isFavorite(property.id)}
              onToggleFavorite={toggleFavorite}
              index={index}
              badge="Active"
            />
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {properties.map((property) => {
                const hasImage = property.property_media && property.property_media.length > 0;
                
                return (
                <CarouselItem key={property.id}>
                  <Link to={`/properties/${property.id}`}>
                    <Card className="overflow-hidden border-border">
                      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                        {hasImage ? (
                          <img 
                            src={property.property_media[0].media_url} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        )}
                        {hasImage && (
                          <>
                            <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                              Active
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                              onClick={(e) => {
                                e.preventDefault();
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
                          </>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
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
                            <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
                              View Details
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default LatestProperties;
