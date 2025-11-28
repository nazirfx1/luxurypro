import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Check if user is already verified or not logged in
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check verification status immediately
    checkVerificationStatus();

    // Set up periodic check every 3 seconds
    const interval = setInterval(() => {
      checkVerificationStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const checkVerificationStatus = async () => {
    if (!user) return;

    setIsChecking(true);
    try {
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      if (refreshedUser?.email_confirmed_at) {
        // User is verified, get their role and redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', refreshedUser.id)
          .single();

        toast.success("Email verified successfully!");
        
        // Redirect based on role
        if (roleData?.role === "tenant") {
          navigate("/tenant/dashboard");
        } else if (roleData?.role === "property_owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;

      toast.success("Verification email sent. Please check your inbox.");
      setResendCountdown(30); // 30 second cooldown
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Luxury Properties" className="h-16 w-auto" />
        </div>

        {/* Main Card */}
        <div className="border border-border rounded-xl p-8 space-y-6 hover:shadow-elegant transition-smooth bg-background">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a verification email to
            </p>
            <p className="font-medium text-foreground">
              {user.email}
            </p>
          </div>

          {/* Status Indicator */}
          <div className="border border-border rounded-lg p-4 bg-background/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isChecking ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-primary animate-pulse" />
                )}
                <span className="text-sm text-foreground">
                  {isChecking ? "Checking..." : "Email not verified"}
                </span>
              </div>
              {user.email_confirmed_at && (
                <CheckCircle className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Please check your inbox and click the verification link to continue.</p>
            <p>Once verified, you'll be automatically redirected to your dashboard.</p>
          </div>

          {/* Resend Button */}
          <Button
            onClick={handleResendEmail}
            disabled={resendCountdown > 0 || isResending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-yellow hover:shadow-yellow-lg transition-smooth"
            size="lg"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : resendCountdown > 0 ? (
              <span>
                Resend in <span className="text-primary-foreground font-semibold">{resendCountdown}s</span>
              </span>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={handleResendEmail}
                disabled={resendCountdown > 0 || isResending}
                className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                resend it
              </button>
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate("/auth");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
