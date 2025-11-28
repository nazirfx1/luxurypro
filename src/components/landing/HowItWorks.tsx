import { Search, Home, Calendar, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Properties",
    description: "Search through our curated collection of premium properties using advanced filters.",
  },
  {
    icon: Home,
    number: "02",
    title: "Check Details",
    description: "View comprehensive property information, photos, virtual tours, and neighborhood insights.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Book a Visit",
    description: "Schedule an in-person viewing at your convenience with our instant booking system.",
  },
  {
    icon: FileCheck,
    number: "04",
    title: "Sign Contract",
    description: "Complete your purchase or rental with our secure digital contract management.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your journey to finding the perfect property in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index} 
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                    style={{ transformOrigin: "left" }}
                  />
                )}

                <motion.div 
                  className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:shadow-primary/10 cursor-pointer"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Number Badge */}
                  <motion.div 
                    className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-yellow"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.15, rotate: 12, backgroundColor: "hsl(var(--primary) / 0.2)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
