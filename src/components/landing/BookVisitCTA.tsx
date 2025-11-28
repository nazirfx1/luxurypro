import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const BookVisitCTA = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Ready to Find Your
              <span className="block text-primary mt-2">Dream Home?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Schedule a personalized property tour with our expert agents. 
              We'll help you find the perfect space that matches your lifestyle.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-yellow group transition-all duration-300 hover:shadow-yellow-lg hover:shadow-primary/50"
                onClick={() => navigate('/auth')}
              >
                <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Book Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10 hover:border-primary group transition-all duration-300"
                onClick={() => navigate('/properties')}
              >
                View Properties
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              "Expert Guidance",
              "Flexible Scheduling",
              "Virtual Tours Available"
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300"
                whileHover={{ y: -4, borderColor: "hsl(var(--primary) / 0.5)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookVisitCTA;
