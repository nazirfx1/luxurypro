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
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [emailCheckTimer, setEmailCheckTimer] = useState<NodeJS.Timeout | null>(null);

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

  // Real-time email validation and availability check
  useEffect(() => {
    // Clear previous timer
    if (emailCheckTimer) {
      clearTimeout(emailCheckTimer);
    }

    // Reset status if email is empty
    if (!emailValue || emailValue.trim() === '') {
      setEmailStatus('idle');
      return;
    }

    // Check email format first using HTML5 validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(emailValue);

    if (!isValidFormat) {
      setEmailStatus('invalid');
      return;
    }

    // Email format is valid, now check availability after debounce
    setEmailStatus('checking');
    
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
          setEmailStatus('idle');
          return;
        }

        if (data) {
          setEmailStatus('taken');
        } else {
          setEmailStatus('available');
        }
      } catch (error) {
        console.error('Error checking email availability:', error);
        setEmailStatus('idle');
      }
    }, 450); // 450ms debounce

    setEmailCheckTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [emailValue]);

  // Check if form is valid for submission
  const isFormValid = 
    emailStatus === 'available' &&
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
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register("fullName")}
          className="transition-smooth"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register("email")}
            className={`transition-smooth pr-10 ${
              emailStatus === 'available' ? 'border-primary' :
              emailStatus === 'taken' || emailStatus === 'invalid' ? 'border-destructive' :
              'border-border'
            }`}
            aria-describedby="email-status"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {emailStatus === 'checking' && (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            )}
            {emailStatus === 'available' && (
              <CheckCircle className="w-4 h-4 text-primary" />
            )}
            {(emailStatus === 'taken' || emailStatus === 'invalid') && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>
        
        {/* Email status messages */}
        <div id="email-status" className="min-h-[20px]">
          {emailStatus === 'invalid' && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Please enter a valid email address.
            </p>
          )}
          {emailStatus === 'taken' && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              This email is already registered.
            </p>
          )}
          {emailStatus === 'available' && (
            <p className="text-sm text-primary flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Email available.
            </p>
          )}
          {emailStatus === 'checking' && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking availability...
            </p>
          )}
        </div>
        
        {errors.email && emailStatus !== 'invalid' && emailStatus !== 'taken' && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Select Role *</Label>
        <Select 
          value={selectedRole} 
          onValueChange={(value) => setValue("role", value as "tenant" | "property_owner", { shouldValidate: true })}
        >
          <SelectTrigger 
            id="role"
            className="w-full bg-background border-foreground border-[1.5px] text-foreground hover:border-primary transition-smooth"
          >
            <SelectValue placeholder="Choose your role" />
          </SelectTrigger>
          <SelectContent className="bg-background border-foreground z-50">
            <SelectItem 
              value="tenant"
              className="text-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer transition-smooth"
            >
              Tenant
            </SelectItem>
            <SelectItem 
              value="property_owner"
              className="text-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer transition-smooth"
            >
              Property Owner
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pr-10 transition-smooth"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          {...register("confirmPassword")}
          className="transition-smooth"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {errors.root && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors.root.message}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-yellow hover:shadow-yellow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
        disabled={isLoading || !isFormValid}
        aria-label="Create account"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};
