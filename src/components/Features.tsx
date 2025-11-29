import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wrench, 
  MessageSquare, 
  TrendingUp,
  Lock,
  Zap
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Multi-Role Dashboards",
    description: "Customized experiences for admins, managers, agents, owners, and tenants with role-specific workflows.",
  },
  {
    icon: Users,
    title: "Client & Lead Management",
    description: "Track prospects, manage interactions, and convert leads with intelligent pipeline management.",
  },
  {
    icon: FileText,
    title: "Digital Lease Hub",
    description: "Centralized lease management with version control, automated reminders, and document workflows.",
  },
  {
    icon: Wrench,
    title: "Smart Maintenance",
    description: "End-to-end ticketing system with real-time updates, contractor scheduling, and status tracking.",
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    description: "Internal communication platform with file attachments and role-based conversations.",
  },
  {
    icon: TrendingUp,
    title: "Financial Intelligence",
    description: "Real-time analytics, Cap Rate calculations, forecasting, and comprehensive expense tracking.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "2FA authentication, audit logs, role-based permissions, and SOC 2 compliance ready.",
  },
  {
    icon: Zap,
    title: "Automation Engine",
    description: "Workflow automation for repetitive tasks, notifications, and business rule enforcement.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background relative overflow-hidden" ref={ref}>
      {/* Subtle animated background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
          backgroundSize: "200% 200%"
        }}
      />
      
      <div className="container px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need to
            <motion.span 
              className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Scale Your Business
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A comprehensive platform designed for modern real estate professionals
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elegant hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Animated gradient overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="flex flex-col space-y-4 relative z-10">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
