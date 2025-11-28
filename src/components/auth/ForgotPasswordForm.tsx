import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    const { error } = await resetPassword(data.email);
    
    if (error) {
      setError("root", {
        message: error.message || "Failed to send reset email",
      });
    } else {
      setEmailSent(true);
    }
    
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="space-y-8 text-center animate-fade-in">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center success-pulse">
          <div className="w-8 h-8 bg-primary rounded-full" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl lg:text-3xl font-bold">Check your email</h3>
          <p className="text-muted-foreground text-sm lg:text-base">
            We've sent you a password reset link. Please check your inbox.
          </p>
        </div>
        
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="w-full h-12 transition-all duration-300 hover:border-primary hover:bg-primary/5 active:scale-95"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:gap-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </button>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h3 className="text-2xl lg:text-3xl font-bold">Forgot password?</h3>
        <p className="text-muted-foreground text-sm lg:text-base">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {/* Email Field with Floating Label */}
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder=" "
          {...register("email")}
          className="peer h-12 pt-4 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Label 
          htmlFor="email"
          className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
        >
          Email
        </Label>
        {errors.email && (
          <p className="text-sm text-destructive mt-1.5 error-slide-down">{errors.email.message}</p>
        )}
      </div>

      {/* Error Banner */}
      {errors.root && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 error-slide-down backdrop-blur-sm">
          <p className="text-sm text-destructive font-medium">{errors.root.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 shadow-yellow-lg hover:shadow-yellow transition-all duration-300 active:scale-95 font-semibold text-base"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
};
