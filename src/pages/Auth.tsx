import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logo from "@/assets/logo.png";

const Auth = () => {
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding Panel */}
      <div className="relative lg:w-1/2 bg-background overflow-hidden auth-slide-left">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-hero opacity-80" />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 border border-primary/20 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 right-20 w-48 h-48 border border-primary/10 rounded-full animate-pulse delay-500" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 lg:p-12 min-h-[300px] lg:min-h-screen">
          {/* Logo with glow effect */}
          <div className="mb-12 transform transition-all duration-300 hover:scale-105 hover-glow">
            <img 
              src={logo} 
              alt="Luxury Properties" 
              className="h-20 lg:h-24 w-auto brightness-0 invert drop-shadow-[0_0_20px_rgba(197,157,0,0.3)]" 
            />
          </div>
          
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground animate-fade-in">
              Welcome to Luxury Pro
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground animate-fade-in delay-200">
              Enterprise-grade real estate management platform trusted by industry leaders worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 animate-fade-in delay-300">
              <div className="space-y-2 group cursor-default">
                <div className="text-3xl lg:text-4xl font-bold text-primary transition-all duration-300 group-hover:scale-110">
                  10K+
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">
                  Properties Managed
                </div>
              </div>
              <div className="space-y-2 group cursor-default">
                <div className="text-3xl lg:text-4xl font-bold text-primary transition-all duration-300 group-hover:scale-110">
                  $2.5B+
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">
                  Portfolio Value
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background auth-slide-right">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (only shown on small screens) */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src={logo} alt="Luxury Properties" className="h-14 w-auto" />
          </div>

          {/* Auth card */}
          <div className="glass-effect rounded-2xl p-6 lg:p-8 shadow-elegant animate-fade-in delay-200">
            {showForgotPassword ? (
              <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-6 animate-fade-in">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Sign in to your account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your credentials to access your dashboard
                    </p>
                  </div>
                  <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 animate-fade-in">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Create an account
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Get started with Luxury Pro today
                    </p>
                  </div>
                  <SignupForm />
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Terms & Privacy */}
          <div className="text-center text-xs lg:text-sm text-muted-foreground animate-fade-in delay-400">
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
