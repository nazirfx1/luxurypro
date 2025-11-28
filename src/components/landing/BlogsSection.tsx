import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-background" ref={ref}>
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Latest <span className="text-primary">Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice and market trends to help you make informed decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:shadow-primary/10 cursor-pointer h-full">
                <div className="relative overflow-hidden aspect-video">
                  <motion.img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span 
                    className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-yellow"
                    whileHover={{ scale: 1.05 }}
                  >
                    {blog.category}
                  </motion.span>
                </div>

                <CardContent className="p-6 space-y-4">
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

                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-hover group/btn">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10 hover:border-primary group transition-all duration-300"
            >
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogsSection;
