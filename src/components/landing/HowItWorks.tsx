import { Search, Eye, Calendar, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Properties",
    description: "Search through our curated collection of premium properties using advanced filters.",
  },
  {
    icon: Eye,
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
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to finding the perfect property in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          <div className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 animate-pulse" style={{ width: "75%" }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Icon Circle */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-yellow-lg hover:scale-110 transition-transform cursor-pointer group">
                      <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-xl font-semibold text-foreground">
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
      </div>
    </section>
  );
};

export default HowItWorks;
