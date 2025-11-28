import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const BookVisitCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary-hover to-primary relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-black rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-black rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-4">
            <Calendar className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
            Schedule a Property Visit in 1 Minute
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Don't wait! Book your exclusive property viewing today and take the first step 
            towards finding your dream home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all px-8"
              onClick={() => window.location.href = '/auth'}
            >
              Book Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all px-8"
              onClick={() => window.location.href = '/properties'}
            >
              View Properties
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span className="text-sm">Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span className="text-sm">Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span className="text-sm">No Commitment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookVisitCTA;
