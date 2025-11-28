import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  {
    name: "David Thompson",
    role: "Property Developer",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    content: "The best real estate platform I've used. Great property listings, excellent customer service, and a user-friendly interface.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 bg-card border-border h-full hover-lift">
                  <div className="flex flex-col h-full space-y-4">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>

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
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
