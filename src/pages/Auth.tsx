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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary text-secondary-foreground items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <img src={logo} alt="Luxury Properties" className="h-24 w-auto brightness-0 invert" />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Welcome to Luxury Pro
            </h1>
            <p className="text-lg text-secondary-foreground/80">
              Enterprise-grade real estate management platform trusted by industry leaders worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-secondary-foreground/60">Properties Managed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$2.5B+</div>
              <div className="text-sm text-secondary-foreground/60">Portfolio Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center">
            <img src={logo} alt="Luxury Properties" className="h-16 w-auto" />
          </div>

          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Sign in to your account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your credentials to access your dashboard
                  </p>
                </div>
                <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">
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

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
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
