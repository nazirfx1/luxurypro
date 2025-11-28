import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      setError("root", {
        message: error.message || "Invalid email or password",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {/* Password Field with Floating Label */}
      <div className="relative">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            {...register("password")}
            className="peer h-12 pt-4 pr-12 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Label 
            htmlFor="password"
            className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
          >
            Password
          </Label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive mt-1.5 error-slide-down">{errors.password.message}</p>
        )}
      </div>

      {/* Error Banner */}
      {errors.root && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 error-slide-down backdrop-blur-sm">
          <p className="text-sm text-destructive font-medium">{errors.root.message}</p>
        </div>
      )}

      {/* Forgot Password Link */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary-hover transition-all duration-200 underline-offset-4 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </div>

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
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};
