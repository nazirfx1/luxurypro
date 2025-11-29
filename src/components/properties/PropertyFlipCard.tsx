import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Heart, Calendar, TrendingUp, Home as HomeIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SharePropertyDialog } from "@/components/properties/SharePropertyDialog";
import PropertyGalleryModal from "./PropertyGalleryModal";

interface PropertyFlipCardProps {
  property: {
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
    property_type?: string | null;
    year_built?: number | null;
    listing_type?: string | null;
  };
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index: number;
  badge?: string;
}

const PropertyFlipCard = ({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  index,
  badge = "Featured" 
}: PropertyFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const hasImage = property.property_media && property.property_media.length > 0;
  const images = property.property_media?.map(m => m.media_url) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (images.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      setIsGalleryOpen(true);
    }
  };

  return (
    <>
      <PropertyGalleryModal
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={0}
        propertyTitle={property.title}
      />
      
      <motion.div
      className="relative h-[500px]"
      style={{ perspective: "1000px" }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94] as any
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Link to={`/properties/${property.id}`}>
            <Card className="h-full overflow-hidden border-background/20 bg-background hover:border-foreground/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl relative">
              {/* Subtle gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 z-10 pointer-events-none"
                transition={{ duration: 0.4 }}
              />

              <div className="relative overflow-hidden aspect-[4/3] bg-muted group/image">
                {hasImage ? (
                  <>
                    <div 
                      className="w-full h-full cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <motion.img 
                        src={property.property_media[0].media_url} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Gallery Icon Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-4"
                      >
                        <ImageIcon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                        {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HomeIcon className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                {hasImage && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <motion.span 
                      className="absolute top-4 left-4 bg-background text-primary px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      whileHover={{ 
                        scale: 1.08,
                        boxShadow: "0 0 15px hsl(0 0% 0% / 0.3)"
                      }}
                    >
                      {badge}
                    </motion.span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm hover:bg-background z-10 border border-background/20"
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(property.id);
                      }}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all ${
                          isFavorite 
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
                      className="text-2xl font-bold text-foreground"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                    >
                      {formatPrice(property.price)}
                    </motion.span>
                    <div className="text-xs text-muted-foreground font-medium">Hover to flip</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <Card className="h-full overflow-hidden border-foreground/30 bg-background shadow-lg">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Property Details</h3>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                </motion.div>
              </div>

              <div className="flex-1 space-y-4 overflow-auto">
                {/* Description */}
                {property.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Property Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {property.property_type && (
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Type</div>
                      <div className="text-sm font-semibold text-foreground capitalize">
                        {property.property_type.replace('_', ' ')}
                      </div>
                    </div>
                  )}
                  
                  {property.listing_type && (
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Listing</div>
                      <div className="text-sm font-semibold text-foreground capitalize">
                        {property.listing_type}
                      </div>
                    </div>
                  )}

                  {property.year_built && (
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>Built</span>
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {property.year_built}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                    <div className="text-sm font-semibold text-foreground">
                      {property.city}, {property.state}
                    </div>
                  </div>
                </div>

                {/* Features Highlights */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Quick Stats</h4>
                  <div className="space-y-2">
                    {property.bedrooms && (
                      <div className="flex items-center justify-between p-2 rounded bg-primary/5">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">Bedrooms</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center justify-between p-2 rounded bg-primary/5">
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">Bathrooms</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.square_feet && (
                      <div className="flex items-center justify-between p-2 rounded bg-primary/5">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">Square Feet</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {property.square_feet.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-4 pt-4 border-t border-border">
                <Link to={`/properties/${property.id}`}>
                  <motion.button
                    className="w-full px-4 py-3 bg-background text-primary rounded-lg text-sm font-bold hover:bg-background/90 transition-colors relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 6px 24px hsl(0 0% 0% / 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-background/90 to-background opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">View Full Details</span>
                  </motion.button>
                </Link>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-foreground">{formatPrice(property.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default PropertyFlipCard;