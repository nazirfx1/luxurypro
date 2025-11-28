import { Shield, TrendingUp, Clock, Headphones, CheckCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is thoroughly verified for authenticity and legal compliance.",
  },
  {
    icon: TrendingUp,
    title: "Best Market Prices",
    description: "Competitive pricing backed by comprehensive market analysis and data.",
  },
  {
    icon: Clock,
    title: "Fast Booking",
    description: "Schedule property visits instantly with our streamlined booking system.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance from our dedicated customer service team.",
  },
  {
    icon: CheckCircle,
    title: "Trusted Platform",
    description: "Join thousands of satisfied clients who found their dream properties with us.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized industry leader in luxury real estate services and innovation.",
  },
];

const stats = [
  { value: "15K+", label: "Happy Clients" },
  { value: "25K+", label: "Properties Listed" },
  { value: "50+", label: "Cities Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Why Choose <span className="text-primary">Us</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience excellence in real estate with our comprehensive suite of services
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card border-border hover-lift group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-2 p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
