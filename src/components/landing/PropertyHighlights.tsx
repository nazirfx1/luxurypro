import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, TrendingUp, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const featuredProperties = [
  {
    id: 1,
    title: "Modern Penthouse Suite",
    location: "Manhattan, New York",
    price: "$4,500,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    beds: 4,
    baths: 3,
    sqft: 3200,
    tag: "New Listing",
    tagColor: "bg-primary"
  },
  {
    id: 2,
    title: "Luxury Waterfront Villa",
    location: "Miami Beach, Florida",
    price: "$7,200,000",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    beds: 5,
    baths: 4,
    sqft: 5500,
    tag: "Hot Deal",
    tagColor: "bg-destructive"
  },
  {
    id: 3,
    title: "Contemporary Loft",
    location: "Los Angeles, California",
    price: "$2,800,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 2,
    sqft: 2400,
    tag: "Luxury",
    tagColor: "bg-primary"
  },
  {
    id: 4,
    title: "Urban Skyline Residence",
    location: "Chicago, Illinois",
    price: "$3,100,000",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 3,
    sqft: 2800,
    tag: "Vacant Now",
    tagColor: "bg-accent"
  },
];

const PropertyHighlights = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Properties</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury properties in prime locations
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Card 
              key={property.id} 
              className="group overflow-hidden bg-card border-border hover-lift cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className={`absolute top-4 right-4 ${property.tagColor} text-white border-none`}>
                  {property.tag}
                </Badge>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-2xl font-bold text-primary">{property.price}</span>
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProperties.map((property) => (
                <CarouselItem key={property.id}>
                  <Card className="overflow-hidden bg-card border-border">
                    <div className="relative overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-64 object-cover"
                      />
                      <Badge className={`absolute top-4 right-4 ${property.tagColor} text-white border-none`}>
                        {property.tag}
                      </Badge>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-2xl font-bold text-primary">{property.price}</span>
                        <Star className="w-5 h-5 text-primary fill-primary" />
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PropertyHighlights;
