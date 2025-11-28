import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-brand-black text-foreground border-t border-border">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <img src={logo} alt="Luxury Properties" className="h-14 w-auto brightness-0 invert" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium real estate platform connecting you with luxury properties worldwide. 
              Your journey to exceptional living starts here.
            </p>
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Building2 className="w-4 h-4" />
              <span className="font-semibold">Trusted Since 2024</span>
            </div>
            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group">
                <Facebook className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group">
                <Twitter className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group">
                <Instagram className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center group">
                <Linkedin className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#properties" className="text-sm text-muted-foreground hover:text-primary transition-colors">Properties</a></li>
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Property Management</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Buy Property</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Rent Property</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Investment Advisory</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Property Valuation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm group">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:info@luxurypro.com" className="text-muted-foreground group-hover:text-primary transition-colors">
                  info@luxurypro.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm group">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-muted-foreground group-hover:text-primary transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Luxury Ave, Suite 100<br />New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Luxury Pro. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
