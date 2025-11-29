import { Button } from "@/components/ui/button";
import { Search, MapPin, Home, DollarSign, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSection = () => {
  const navigate = useNavigate();
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [filteredCities, setFilteredCities] = useState<Array<{ id: string; name: string; state: string }>>([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orb1X = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const orb1Y = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);
  const orb2X = useTransform(mouseX, [0, window.innerWidth], [20, -20]);
  const orb2Y = useTransform(mouseY, [0, window.innerHeight], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType && propertyType !== 'all') params.set('type', propertyType);
    if (priceRange && priceRange !== 'all') params.set('price', priceRange);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 pt-24 md:pt-20 pb-12 md:pb-0">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          style={{ x: orb1X, y: orb1Y }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{ x: orb2X, y: orb2Y }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Main Heading */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight px-4 md:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Find Your Perfect
            <motion.span 
              className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Dream Property
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 md:px-0 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover exclusive properties tailored to your lifestyle. 
            From luxury estates to urban apartments, find your next home with ease.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-4xl mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-6 shadow-elegant"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
              <div className="relative flex items-center gap-3 px-3 md:px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all duration-200 touch-manipulation">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <Input 
                  ref={locationInputRef}
                  placeholder="Location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => location && setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground text-base"
                />
                {showCitySuggestions && filteredCities.length > 0 && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setLocation(`${city.name}, ${city.state}`);
                          setShowCitySuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 text-foreground flex items-center gap-2 touch-manipulation"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{city.name}, {city.state}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all duration-200 px-1 touch-manipulation">
                <Home className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="border-none bg-transparent text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-transparent transition-all text-base">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-xl z-[100]">
                    <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">All Types</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem 
                        key={type} 
                        value={type}
                        className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer capitalize text-base"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all duration-200 px-1 touch-manipulation">
                <DollarSign className="w-5 h-5 text-primary ml-2 flex-shrink-0" />
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-none bg-transparent text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-transparent transition-all text-base">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-xl z-[100]">
                    <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">All Prices</SelectItem>
                    <SelectItem value="0-500000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">$0 - $500K</SelectItem>
                    <SelectItem value="500000-1000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">$500K - $1M</SelectItem>
                    <SelectItem value="1000000-2000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">$1M - $2M</SelectItem>
                    <SelectItem value="2000000-5000000" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">$2M - $5M</SelectItem>
                    <SelectItem value="5000000+" className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer text-base">$5M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow transition-all duration-300 hover:shadow-yellow-lg hover:shadow-primary/50 text-base md:text-lg h-12 md:h-14 touch-manipulation"
                size="lg"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow transition-all duration-300 hover:shadow-yellow-lg hover:shadow-primary/50 h-12 md:h-14 px-6 md:px-8 text-base touch-manipulation"
                onClick={() => navigate('/properties')}
              >
                Browse Properties
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-border hover:bg-muted hover:border-primary/50 transition-all duration-300 h-12 md:h-14 px-6 md:px-8 text-base touch-manipulation"
                onClick={() => navigate('/auth')}
              >
                Book a Visit
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Button 
                size="lg" 
                variant="ghost"
                className="w-full sm:w-auto hover:text-primary transition-all duration-300 h-12 md:h-14 px-6 md:px-8 text-base touch-manipulation"
                onClick={() => navigate('/auth')}
              >
                Create Account
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-primary opacity-50" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
