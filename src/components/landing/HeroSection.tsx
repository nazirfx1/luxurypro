import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

const HeroSection = () => {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [filteredCities, setFilteredCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch unique property types from database
    const fetchPropertyTypes = async () => {
      const { data } = await supabase
        .from('properties')
        .select('property_type')
        .not('property_type', 'is', null);
      
      if (data) {
        const uniqueTypes = [...new Set(data.map(p => p.property_type).filter(Boolean))];
        setPropertyTypes(uniqueTypes as string[]);
      }
    };

    // Fetch cities
    const fetchCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('id, name, state')
        .order('name');
      
      if (data) {
        setCities(data);
      }
    };

    fetchPropertyTypes();
    fetchCities();

    // Subscribe to realtime updates
    const propertiesChannel = supabase
      .channel('properties-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          fetchPropertyTypes();
        }
      )
      .subscribe();

    const citiesChannel = supabase
      .channel('cities-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cities' },
        () => {
          fetchCities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(citiesChannel);
    };
  }, []);

  useEffect(() => {
    if (location) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(location.toLowerCase()) ||
        city.state?.toLowerCase().includes(location.toLowerCase())
      ).slice(0, 5);
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  }, [location, cities]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 px-4 py-32">
        <div className="flex flex-col items-center text-center space-y-10 max-w-6xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up delay-100">
            Find Your Perfect
            <span className="block mt-2 text-primary">Luxury Property</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl animate-fade-in-up delay-200">
            Discover exceptional properties across prime locations. Your dream home is just a search away.
          </p>

          {/* Advanced Search Bar */}
          <div className="w-full max-w-5xl glass-effect rounded-2xl p-4 md:p-6 animate-fade-in-up delay-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                <MapPin className="w-5 h-5 text-primary" />
                <Input 
                  ref={locationInputRef}
                  placeholder="Location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => location && setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                />
                {showCitySuggestions && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setLocation(`${city.name}, ${city.state}`);
                          setShowCitySuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-smooth text-foreground flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{city.name}, {city.state}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary ml-3" />
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="border-none bg-muted/50 text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-muted/70 transition-smooth">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">All Types</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem 
                        key={type} 
                        value={type}
                        className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary ml-3" />
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-none bg-muted/50 text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-muted/70 transition-smooth">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">All Prices</SelectItem>
                    <SelectItem value="0-500000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">$0 - $500K</SelectItem>
                    <SelectItem value="500000-1000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">$500K - $1M</SelectItem>
                    <SelectItem value="1000000-2000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">$1M - $2M</SelectItem>
                    <SelectItem value="2000000-5000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">$2M - $5M</SelectItem>
                    <SelectItem value="5000000+" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">$5M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow transition-smooth h-full"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (location) params.set('location', location);
                  if (propertyType && propertyType !== 'all') params.set('type', propertyType);
                  if (priceRange && priceRange !== 'all') params.set('price', priceRange);
                  window.location.href = `/properties?${params.toString()}`;
                }}
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up delay-400">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow hover:shadow-yellow-lg transition-smooth px-8"
              onClick={() => window.location.href = '/properties'}
            >
              Browse Properties
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth px-8"
              onClick={() => window.location.href = '/auth'}
            >
              Book a Visit
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-foreground/20 text-foreground hover:bg-muted transition-smooth px-8"
              onClick={() => window.location.href = '/auth'}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
