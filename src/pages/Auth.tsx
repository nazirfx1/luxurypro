import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Shield, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import logo from "@/assets/logo.png";

const Auth = () => {
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("login");
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle swipe gestures on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeTab === "login") {
      setActiveTab("signup");
    }
    if (isRightSwipe && activeTab === "signup") {
      setActiveTab("login");
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <img src={logo} alt="Luxury Properties" className="h-20 w-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2 bg-gradient-to-br from-black via-black to-black/95 p-6 md:p-8 lg:p-16 flex-col justify-center relative overflow-hidden">
        {/* Decorative gradient orbs with parallax */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{ transform: `translate(${-mousePosition.x * 0.8}px, ${-mousePosition.y * 0.8}px)` }}
        ></div>
        
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-12 group">
            <img 
              src={logo} 
              alt="Luxury Pro" 
              className="h-12 w-auto filter brightness-0 invert animate-fade-in-up animate-float transition-all duration-700 hover:scale-110 hover:brightness-110"
              style={{ 
                filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(197, 154, 0, 0.3))',
              }}
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 animate-slide-in-left group-hover:scale-105 transition-all duration-500 bg-gradient-to-r from-primary via-white to-secondary bg-clip-text hover:text-transparent">
            Welcome to Luxury Pro
          </h1>
          
          <p className="text-xl text-white/80 mb-12 animate-slide-in-right delay-300 transition-all duration-300 hover:opacity-100 hover:translate-x-2">
            The future of real estate management
          </p>

          {/* Feature highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 animate-fade-in group transition-all duration-500 hover:scale-105 hover:translate-x-2 cursor-pointer glass-card p-4 rounded-xl hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 neon-glow">
                <Building2 className="w-6 h-6 text-primary transition-all duration-500 group-hover:rotate-180" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">Smart Property Management</h3>
                <p className="text-white/60 text-sm transition-all duration-300 group-hover:translate-y-1">Manage all your properties from one powerful dashboard</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-fade-in delay-200 group transition-all duration-500 hover:scale-105 hover:translate-x-2 cursor-pointer glass-card p-4 rounded-xl hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 neon-glow">
                <Users className="w-6 h-6 text-primary transition-all duration-500 group-hover:rotate-180 group-hover:animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">Tenant Portal</h3>
                <p className="text-white/60 text-sm transition-all duration-300 group-hover:translate-y-1">Seamless communication and payment processing</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-fade-in delay-500 group transition-all duration-500 hover:scale-105 hover:translate-x-2 cursor-pointer glass-card p-4 rounded-xl hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 neon-glow">
                <Shield className="w-6 h-6 text-primary transition-all duration-500 group-hover:rotate-180 group-hover:animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">Enterprise Security</h3>
                <p className="text-white/60 text-sm transition-all duration-300 group-hover:translate-y-1">Bank-level encryption and data protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms (full-width on mobile) */}
      <div className="w-full md:w-1/2 lg:w-1/2 bg-black p-6 sm:p-8 md:p-12 lg:p-16 flex items-center justify-center relative overflow-hidden min-h-screen">
        {/* Floating orbs with animations and parallax */}
        <div 
          className="absolute top-10 md:top-20 right-10 md:right-20 w-48 md:w-64 h-48 md:h-64 bg-primary/10 rounded-full blur-3xl animate-float animate-glow-pulse transition-transform duration-500"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-32 md:w-48 h-32 md:h-48 bg-primary/5 rounded-full blur-2xl animate-float transition-transform duration-500"
          style={{ animationDelay: '2s', transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-56 h-40 md:h-56 bg-primary/5 rounded-full blur-lg animate-glow-pulse transition-transform duration-500"
          style={{ animationDelay: '1s', transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)` }}
        ></div>
        
        <div className="w-full max-w-md relative z-10 px-4 sm:px-0">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="md:hidden mb-6 text-center">
            <img 
              src={logo} 
              alt="Luxury Pro" 
              className="h-16 w-auto mx-auto filter brightness-0 invert"
              style={{ 
                filter: 'brightness(0) invert(1) drop-shadow(0 0 15px rgba(197, 154, 0, 0.4))',
              }}
            />
          </div>

          {/* Collapsible Learn More - Only visible on mobile */}
          <Collapsible 
            open={isLearnMoreOpen} 
            onOpenChange={setIsLearnMoreOpen}
            className="md:hidden mb-4"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 glass-card rounded-xl text-white hover:bg-primary/5 transition-all">
              <span className="text-sm font-medium">Why Luxury Pro?</span>
              <ChevronDown 
                className={`w-5 h-5 text-primary transition-transform duration-300 ${
                  isLearnMoreOpen ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 animate-accordion-down">
              <div className="flex items-start gap-3 p-3 glass-card rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Smart Property Management</h4>
                  <p className="text-white/60 text-xs">Manage all your properties from one powerful dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 glass-card rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Tenant Portal</h4>
                  <p className="text-white/60 text-xs">Seamless communication and payment processing</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 glass-card rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Enterprise Security</h4>
                  <p className="text-white/60 text-xs">Bank-level encryption and data protection</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-elegant transform-gpu">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center animate-fade-in-up group-hover:scale-105 transition-all duration-500 bg-gradient-to-r from-primary via-white to-primary bg-clip-text hover:text-transparent">
              {showForgotPassword ? "Reset Password" : "Get Started"}
            </h2>

            {showForgotPassword ? (
              <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
            ) : (
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-scale-in">
                <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 glass-card transition-all duration-300 hover:border-primary/50 h-12 sm:h-auto">
                  <TabsTrigger 
                    value="login" 
                    className="text-sm sm:text-base transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground data-[state=active]:neon-glow"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-sm sm:text-base transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground data-[state=active]:neon-glow"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="animate-fade-in">
                  <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
                </TabsContent>

                <TabsContent value="signup" className="animate-fade-in">
                  <SignupForm />
                </TabsContent>
              </Tabs>
              </div>
            )}
          </div>

          {/* Terms & Privacy */}
          <div className="text-center text-xs sm:text-sm text-white/60 mt-4 sm:mt-6 animate-fade-in delay-400 px-4">
            <p>
              By continuing, you agree to our{" "}
              <a 
                href="#" 
                className="text-primary hover:text-primary-hover transition-colors underline-offset-4 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a 
                href="#" 
                className="text-primary hover:text-primary-hover transition-colors underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
