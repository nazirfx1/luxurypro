import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { SharePropertyDialog } from "@/components/properties/SharePropertyDialog";
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
  property_media: Array<{ media_url: string }>;
}

const PropertyHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      console.log('Fetching featured properties...');
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, description, city, state, price, bedrooms, bathrooms, square_feet, property_media(media_url)")
        .eq("status", "active")
        .eq("is_featured", true)
        .order("updated_at", { ascending: false })
        .limit(10);

      console.log('Featured properties data:', data);
      console.log('Featured properties error:', error);

      if (!error && data) {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchFeaturedProperties();

    // Realtime subscription
    const channel = supabase
      .channel("featured-properties-landing")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        fetchFeaturedProperties
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_media" },
        fetchFeaturedProperties
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Always render the section, show loading or empty state as needed
  const shouldShowSection = loading || properties.length > 0;

  if (!shouldShowSection) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Parallax background effect */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.05) 0%, transparent 60%)",
        }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={isInView ? { 
          scale: 1, 
          opacity: 0.2,
          y: [0, -20, 0]
        } : { scale: 1.2, opacity: 0 }}
        transition={{ 
          duration: 1.5,
          y: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      <div className="container px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Featured <motion.span 
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >Properties</motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Handpicked luxury properties in prime locations
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                    <div className="h-8 bg-muted rounded w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Desktop Grid */}
        {!loading && properties.length > 0 && (
          <motion.div 
            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <Link to={`/properties/${property.id}`}>
                <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-elegant hover:shadow-primary/10 relative">
                  {/* Animated shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent z-10 pointer-events-none"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <Link to={`/properties/${property.id}`}>
                      <motion.img 
                        src={property.property_media[0]?.media_url || "/placeholder.svg"} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </Link>
                    <motion.span 
                      className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-yellow"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
                      }}
                    >
                      Featured
                    </motion.span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
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
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{property.city}, {property.state}</span>
                          </div>
                        </div>
                        <SharePropertyDialog
                          propertyId={property.id}
                          propertyTitle={property.title}
                          propertyPrice={property.price}
                          propertyImage={property.property_media[0]?.media_url}
                        />
                      </div>
                      {property.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {property.description}
                        </p>
                      )}

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
                        <motion.span 
                          className="text-2xl font-bold text-primary"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          {formatPrice(property.price)}
                        </motion.span>
                        <motion.button
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors relative overflow-hidden"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 4px 20px hsl(var(--primary) / 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="absolute inset-0 bg-primary-glow"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">View Details</span>
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        )}

        {/* Mobile Carousel */}
        {!loading && properties.length > 0 && (
          <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {properties.map((property) => (
                <CarouselItem key={property.id}>
                  <Link to={`/properties/${property.id}`}>
                    <Card className="overflow-hidden border-border">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <Link to={`/properties/${property.id}`}>
                          <img 
                            src={property.property_media[0]?.media_url || "/placeholder.svg"} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </Link>
                        <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
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
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyHighlights;
