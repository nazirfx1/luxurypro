import { Card } from "@/components/ui/card";
import { 
  Wifi, 
  Car, 
  Dumbbell, 
  Waves, 
  Wind, 
  Shield,
  Trees,
  Sofa,
  Utensils,
  Tv,
} from "lucide-react";

interface PropertyAmenitiesProps {
  features: any;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  pool: Waves,
  ac: Wind,
  security: Shield,
  garden: Trees,
  furnished: Sofa,
  kitchen: Utensils,
  entertainment: Tv,
};

const PropertyAmenities = ({ features }: PropertyAmenitiesProps) => {
  const amenities = Array.isArray(features) ? features : [];

  if (amenities.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 text-lg">Amenities & Features</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity: string, index: number) => {
          const Icon = amenityIcons[amenity.toLowerCase()] || Wifi;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-smooth"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium capitalize">{amenity}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PropertyAmenities;
