import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PropertyHighlights from "@/components/landing/PropertyHighlights";
import LatestProperties from "@/components/landing/LatestProperties";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HowItWorks from "@/components/landing/HowItWorks";
import BookVisitCTA from "@/components/landing/BookVisitCTA";
import Testimonials from "@/components/landing/Testimonials";
import DownloadApp from "@/components/landing/DownloadApp";
import BlogsSection from "@/components/landing/BlogsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="properties">
        <PropertyHighlights />
      </div>
      <div id="latest-properties">
        <LatestProperties />
      </div>
      <div id="why-choose-us">
        <WhyChooseUs />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <BookVisitCTA />
      <div id="testimonials">
        <Testimonials />
      </div>
      <DownloadApp />
      <div id="blog">
        <BlogsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
