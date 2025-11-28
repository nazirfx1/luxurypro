import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Property Owner",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    content: "Finding my dream penthouse was effortless with this platform. The team was professional, responsive, and made the entire process seamless.",
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    content: "As an investor, I need accurate data and quick responses. This platform exceeded my expectations in every way. Highly recommended!",
  },
  {
    name: "Emily Rodriguez",
    role: "First-Time Buyer",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    content: "The booking process was incredibly smooth and the property details were comprehensive. I felt confident throughout my purchase journey.",
  },
];

const Testimonials = () => {
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
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from satisfied property seekers and homeowners
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:shadow-primary/10 group">
                      <CardContent className="p-6 flex flex-col h-full space-y-4">
                        {/* Quote Icon */}
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Quote className="w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
                        </motion.div>

                        {/* Rating */}
                        <div className="flex gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-muted-foreground leading-relaxed flex-grow">
                          "{testimonial.content}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
