import { Button } from "@/components/ui/button";
import { Apple, PlaySquare } from "lucide-react";
import mobileMockupDashboard from "@/assets/mobile-mockup-dashboard.png";
import mobileMockupSignin from "@/assets/mobile-mockup-signin.png";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const DownloadApp = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
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
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 px-8 transition-all duration-300"
                >
                  <Apple className="w-6 h-6 mr-2" />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-foreground/20 hover:bg-muted px-8 transition-all duration-300"
                >
                  <PlaySquare className="w-6 h-6 mr-2" />
                  <div className="text-left">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-2 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { title: "Real-time Updates", desc: "Instant notifications" },
                { title: "Easy Booking", desc: "One-tap scheduling" },
                { title: "Saved Searches", desc: "Never miss a listing" },
                { title: "Secure Messaging", desc: "Direct communication" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-primary rounded-full mt-2"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* App Mockups */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-4">
              {/* Sign In Mockup */}
              <motion.div 
                className="w-64 h-[500px] bg-card border-8 border-border rounded-[3rem] shadow-2xl overflow-hidden"
                initial={{ rotate: 6 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={mobileMockupSignin} 
                  alt="Mobile app sign in screen" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Dashboard Mockup */}
              <motion.div 
                className="w-64 h-[500px] bg-card border-8 border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                initial={{ rotate: -6 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={mobileMockupDashboard} 
                  alt="Mobile app dashboard screen" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
