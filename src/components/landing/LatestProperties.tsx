import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
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
  city: string | null;
  state: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  property_media: Array<{ media_url: string }>;
}

const LatestProperties = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_media(media_url)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchLatestProperties();

    // Realtime subscription
    const channel = supabase
      .channel("latest-properties-landing")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        fetchLatestProperties
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_media" },
        fetchLatestProperties
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

  if (loading || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Latest <span className="text-primary">Properties</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our newest property listings
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/properties/${property.id}`}>
                <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-elegant hover:shadow-primary/10">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <motion.img 
                      src={property.property_media[0]?.media_url || "/placeholder.svg"} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-yellow"
                      whileHover={{ scale: 1.05 }}
                    >
                      New
                    </motion.span>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{property.city}, {property.state}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          <span>{property.square_feet} sqft</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {properties.map((property) => (
                <CarouselItem key={property.id}>
                  <Link to={`/properties/${property.id}`}>
                    <Card className="overflow-hidden border-border">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img 
                          src={property.property_media[0]?.media_url || "/placeholder.svg"} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          New
                        </span>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{property.city}, {property.state}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              <span>{property.square_feet} sqft</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
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
      </div>
    </section>
  );
};

export default LatestProperties;
