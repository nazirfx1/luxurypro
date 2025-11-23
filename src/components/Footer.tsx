import { Building2, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Luxury Properties" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Enterprise-grade real estate management platform trusted by industry leaders worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Since 2024</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <span>support@luxurypro.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 Luxury Ave, Suite 100<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-secondary-foreground/60">
              © 2024 Luxury Pro. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
