import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogs = [
  {
    title: "Top 10 Investment Tips for 2025",
    excerpt: "Discover the latest strategies for maximizing returns in luxury real estate investments this year.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    author: "John Smith",
    date: "Jan 15, 2025",
    category: "Investment",
  },
  {
    title: "Market Insights: Urban vs Suburban",
    excerpt: "Analysis of current trends showing shifts in buyer preferences post-pandemic era.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    author: "Sarah Williams",
    date: "Jan 12, 2025",
    category: "Market Trends",
  },
  {
    title: "Luxury Home Features in High Demand",
    excerpt: "From smart home technology to wellness spaces - what today's luxury buyers are seeking.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    author: "Michael Chen",
    date: "Jan 10, 2025",
    category: "Luxury Living",
  },
];

const BlogsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Latest <span className="text-primary">Insights</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with expert insights, market trends, and investment tips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <Card 
              key={index}
              className="group overflow-hidden bg-card border-border hover-lift cursor-pointer"
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {blog.excerpt}
                </p>

                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary-hover hover:bg-transparent p-0 h-auto font-semibold group/btn"
                >
                  Read More 
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth px-8"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
