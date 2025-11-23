import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, TrendingUp, Shield } from "lucide-react";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-4 animate-fade-in">
            <img src={logo} alt="Luxury Properties" className="h-32 w-auto" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in-up delay-100">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Enterprise-Grade Property Management</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up delay-200">
            Redefining Luxury
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Real Estate Management
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed animate-fade-in-up delay-300">
            The complete platform for property owners, managers, and agents. Streamline operations, maximize returns, and deliver exceptional experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-400">
            <Button size="lg" className="gap-2 shadow-gold hover:shadow-gold/50 transition-all" onClick={() => window.location.href = '/auth'}>
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 w-full max-w-3xl animate-fade-in-up delay-500">
            <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-card shadow-card transition-smooth hover:shadow-elegant">
              <Building2 className="w-8 h-8 text-primary mb-2" />
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Properties Managed</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-card shadow-card transition-smooth hover:shadow-elegant">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <div className="text-3xl font-bold text-foreground">$2.5B+</div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-card shadow-card transition-smooth hover:shadow-elegant">
              <Shield className="w-8 h-8 text-primary mb-2" />
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
