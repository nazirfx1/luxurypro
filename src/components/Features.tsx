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

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything You Need to
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed for modern real estate professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
