import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredProperties = [
  {
    title: "Modern Penthouse Suite",
    location: "Manhattan, New York",
    price: "$4,500,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    beds: 4,
    baths: 3,
    sqft: 3200,
    tag: "New Listing",
  },
  {
    title: "Luxury Waterfront Villa",
    location: "Miami Beach, Florida",
    price: "$7,200,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    beds: 5,
    baths: 4,
    sqft: 5500,
    tag: "Hot Deal",
  },
  {
    title: "Contemporary Loft",
    location: "Los Angeles, California",
    price: "$2,800,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 2,
    sqft: 2400,
    tag: "Luxury",
  },
];

const PropertyHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-background" ref={ref}>
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Properties</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury properties in prime locations
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-elegant hover:shadow-primary/10">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <motion.img 
                    src={property.image} 
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
                    {property.tag}
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
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-2xl font-bold text-primary">{property.price}</span>
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProperties.map((property, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-border">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {property.tag}
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
                            <span className="text-sm">{property.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.beds}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.baths}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.sqft} sqft</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-2xl font-bold text-primary">{property.price}</span>
                          <Star className="w-5 h-5 text-primary fill-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

export default PropertyHighlights;
