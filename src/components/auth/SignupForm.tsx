import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield, ShieldCheck, ShieldAlert } from "lucide-react";

// Password strength calculation
const calculatePasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  feedback: string[];
} => {
  if (!password) {
    return { strength: 'weak', score: 0, feedback: [] };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add numbers');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Add special characters (!@#$%^&*)');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 80) {
    strength = 'strong';
  } else if (score >= 50) {
    strength = 'medium';
  }

  return { strength, score, feedback };
};

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(["tenant", "property_owner"], { 
    required_error: "Please select a role" 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailCheckTimer, setEmailCheckTimer] = useState<NodeJS.Timeout | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    status: 'idle' | 'checking' | 'valid' | 'taken' | 'invalid';
    message?: string;
  }>({ status: 'idle' });
  const [passwordStrength, setPasswordStrength] = useState<{
    strength: 'weak' | 'medium' | 'strong';
    score: number;
    feedback: string[];
  }>({ strength: 'weak', score: 0, feedback: [] });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const selectedRole = watch("role");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const fullNameValue = watch("fullName");

  // Real-time password strength calculation
  useEffect(() => {
    if (passwordValue) {
      const result = calculatePasswordStrength(passwordValue);
      setPasswordStrength(result);
    } else {
      setPasswordStrength({ strength: 'weak', score: 0, feedback: [] });
    }
  }, [passwordValue]);

  // Real-time email validation and availability check
  useEffect(() => {
    // Clear previous timer
    if (emailCheckTimer) {
      clearTimeout(emailCheckTimer);
    }

    // Reset status if email is empty
    if (!emailValue || emailValue.trim() === '') {
      setEmailStatus({ status: 'idle' });
      return;
    }

    // Check email format first using HTML5 validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(emailValue);

    if (!isValidFormat) {
      setEmailStatus({ 
        status: 'invalid', 
        message: 'Please enter a valid email address.' 
      });
      return;
    }

    // Email format is valid, now check availability after debounce
    setEmailStatus({ status: 'checking', message: 'Checking...' });
    
    const timer = setTimeout(async () => {
      try {
        // Check if email exists in profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', emailValue.toLowerCase())
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking email:', error);
          setEmailStatus({ status: 'idle' });
          return;
        }

        if (data) {
          setEmailStatus({ 
            status: 'taken', 
            message: 'This email is already registered.' 
          });
        } else {
          setEmailStatus({ 
            status: 'valid', 
            message: 'Email available.' 
          });
        }
      } catch (error) {
        console.error('Error checking email availability:', error);
        setEmailStatus({ status: 'idle' });
      }
    }, 450); // 450ms debounce

    setEmailCheckTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [emailValue]);

  // Check if form is valid for submission
  const isFormValid = 
    emailStatus.status === 'valid' &&
    selectedRole &&
    fullNameValue?.length >= 2 &&
    passwordValue?.length >= 8 &&
    passwordValue === confirmPasswordValue;

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.role);
    
    if (error) {
      if (error.message?.includes("already registered")) {
        setError("email", {
          message: "This email is already registered. Please sign in instead.",
        });
      } else {
        setError("root", {
          message: error.message || "Failed to create account",
        });
      }
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name Field with Floating Label */}
      <div className="relative animate-slide-in-left transform-gpu">
        <Input
          id="fullName"
          type="text"
          placeholder=" "
          {...register("fullName")}
          className="peer h-12 pt-4 glass-card transition-all duration-500 hover:scale-[1.02] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:neon-glow"
        />
        <Label 
          htmlFor="fullName"
          className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
        >
          Full Name
        </Label>
        {errors.fullName && (
          <p className="text-sm text-destructive mt-1.5 error-slide-down">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email Field with Floating Label & Status */}
      <div className="relative animate-slide-in-left delay-100 transform-gpu">
        <Input
          id="email"
          type="email"
          placeholder=" "
          {...register("email")}
          className={`peer h-12 pt-4 glass-card transition-all duration-500 hover:scale-[1.02] ${
            emailStatus.status === 'valid' 
              ? 'border-primary focus:border-primary' 
              : emailStatus.status === 'taken'
              ? 'border-yellow-500 focus:border-yellow-500'
              : emailStatus.status === 'invalid'
              ? 'border-destructive focus:border-destructive'
              : 'focus:border-primary'
          } focus:ring-2 ${
            emailStatus.status === 'valid' 
              ? 'focus:ring-primary/20' 
              : emailStatus.status === 'taken'
              ? 'focus:ring-yellow-500/20'
              : emailStatus.status === 'invalid'
              ? 'focus:ring-destructive/20'
              : 'focus:ring-primary/20'
          }`}
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
        {emailStatus.message && (
          <p className={`text-sm mt-1.5 font-medium animate-fade-in ${
            emailStatus.status === 'valid' 
              ? 'text-primary' 
              : emailStatus.status === 'invalid'
              ? 'text-destructive'
              : 'text-yellow-500'
          }`}>
            {emailStatus.message}
          </p>
        )}
      </div>

      {/* Password Field with Floating Label & Strength Meter */}
      <div className="relative space-y-3 animate-slide-in-left delay-200 transform-gpu">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            {...register("password")}
            className="peer h-12 pt-4 pr-12 glass-card transition-all duration-500 hover:scale-[1.02] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:neon-glow"
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

        {/* Password Strength Meter */}
        {passwordValue && (
          <div className="space-y-2 animate-fade-in">
            {/* Strength Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    passwordStrength.strength === 'strong' 
                      ? 'bg-primary w-full' 
                      : passwordStrength.strength === 'medium'
                      ? 'bg-yellow-500 w-2/3'
                      : 'bg-destructive w-1/3'
                  }`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              
              {/* Strength Icon & Label */}
              <div className="flex items-center gap-1.5">
                {passwordStrength.strength === 'strong' && (
                  <>
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">Strong</span>
                  </>
                )}
                {passwordStrength.strength === 'medium' && (
                  <>
                    <Shield className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-semibold text-yellow-500">Medium</span>
                  </>
                )}
                {passwordStrength.strength === 'weak' && (
                  <>
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-semibold text-destructive">Weak</span>
                  </>
                )}
              </div>
            </div>

            {/* Strength Feedback */}
            {passwordStrength.feedback.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {passwordStrength.feedback.map((tip, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {errors.password && (
          <p className="text-sm text-destructive error-slide-down">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field with Floating Label */}
      <div className="relative animate-slide-in-left delay-300 transform-gpu">
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder=" "
            {...register("confirmPassword")}
            className="peer h-12 pt-4 pr-12 glass-card transition-all duration-500 hover:scale-[1.02] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:neon-glow"
          />
          <Label 
            htmlFor="confirmPassword"
            className="absolute left-3 top-3 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
          >
            Confirm Password
          </Label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1.5 error-slide-down">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className="relative">
        <Label htmlFor="role" className="text-sm font-medium mb-2 block">I am a</Label>
        <Select onValueChange={(value: "tenant" | "property_owner") => setValue("role", value)}>
          <SelectTrigger 
            id="role" 
            className="h-12 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="tenant">Tenant</SelectItem>
            <SelectItem value="property_owner">Property Owner</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive mt-1.5 error-slide-down">{errors.role.message}</p>
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
        className={`w-full h-12 bg-gradient-to-r from-primary to-primary-glow shadow-yellow-lg hover:shadow-yellow transition-all duration-500 hover:scale-105 active:scale-95 font-semibold text-base neon-glow transform-gpu ${
          !isFormValid || isLoading ? 'opacity-50' : ''
        }`}
        size="lg"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};
