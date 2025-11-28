import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
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
          {/* Logo */}
          <div className="animate-fade-in">
            <img src={logo} alt="Luxury Properties" className="h-20 md:h-28 w-auto brightness-0 invert" />
          </div>

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
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                <MapPin className="w-5 h-5 text-primary" />
                <Input 
                  placeholder="Location" 
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                <Home className="w-5 h-5 text-primary" />
                <select className="w-full border-none bg-transparent focus:outline-none text-foreground">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                <DollarSign className="w-5 h-5 text-primary" />
                <select className="w-full border-none bg-transparent focus:outline-none text-foreground">
                  <option value="">Price Range</option>
                  <option value="0-500k">$0 - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-2m">$1M - $2M</option>
                  <option value="2m+">$2M+</option>
                </select>
              </div>

              <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow transition-smooth h-full">
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
