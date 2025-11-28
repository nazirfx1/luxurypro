import { Button } from "@/components/ui/button";
import { Smartphone, Apple, PlaySquare } from "lucide-react";

const DownloadApp = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start w-16 h-16 rounded-2xl bg-primary/10">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Track Your Property Journey
                <span className="block text-primary mt-2">From Anywhere</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Download our mobile app and manage your property search, bookings, 
                and communications on the go. Available for iOS and Android.
              </p>
            </div>

            {/* App Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                <Apple className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-base font-semibold">App Store</div>
                </div>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-foreground/20 hover:bg-muted px-8"
              >
                <PlaySquare className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs opacity-80">GET IT ON</div>
                  <div className="text-base font-semibold">Google Play</div>
                </div>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground">Real-time Updates</h4>
                  <p className="text-sm text-muted-foreground">Instant notifications</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground">Easy Booking</h4>
                  <p className="text-sm text-muted-foreground">One-tap scheduling</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground">Saved Searches</h4>
                  <p className="text-sm text-muted-foreground">Never miss a listing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-foreground">Secure Messaging</h4>
                  <p className="text-sm text-muted-foreground">Direct communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Mockups */}
          <div className="relative">
            <div className="flex items-center justify-center gap-4">
              {/* iPhone Mockup */}
              <div className="w-64 h-[500px] bg-card border-8 border-border rounded-[3rem] shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-full flex items-center justify-center">
                  <Smartphone className="w-20 h-20 text-primary" />
                </div>
              </div>
              
              {/* Android Mockup */}
              <div className="w-64 h-[500px] bg-card border-8 border-border rounded-[2.5rem] shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform">
                <div className="bg-gradient-to-br from-primary/5 to-primary/20 h-full flex items-center justify-center">
                  <Smartphone className="w-20 h-20 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
