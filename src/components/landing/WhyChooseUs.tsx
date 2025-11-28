import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Users, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is thoroughly verified for authenticity and legal compliance.",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive pricing backed by comprehensive market analysis and data.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Professional agents with deep knowledge of luxury real estate markets.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock assistance from our dedicated customer service team.",
  },
];

const stats = [
  { value: "10K+", label: "Properties Managed" },
  { value: "$2.5B+", label: "Portfolio Value" },
  { value: "99.9%", label: "Client Satisfaction" },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Why Choose <span className="text-primary">Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience unparalleled service and expertise in real estate
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:shadow-primary/10 cursor-pointer h-full">
                  <CardContent className="p-6 space-y-4">
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary) / 0.2)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:shadow-primary/10 cursor-pointer group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-primary mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
