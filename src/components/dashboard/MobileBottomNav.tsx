import { Home, MessageSquare, Wrench, Building2, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        setUserRole(data?.role || null);
      }
    };
    fetchUserRole();
  }, []);

  const tenantNavItems = [
    { icon: Home, label: "Home", path: "/tenant/dashboard" },
    { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
    { icon: Wrench, label: "Requests", path: "/dashboard/maintenance" },
    { icon: User, label: "Profile", path: "/dashboard/settings" },
  ];

  const ownerNavItems = [
    { icon: Home, label: "Home", path: "/owner/dashboard" },
    { icon: Building2, label: "Properties", path: "/dashboard/properties" },
    { icon: MessageSquare, label: "Messages", path: "/dashboard/messages" },
    { icon: User, label: "Profile", path: "/dashboard/settings" },
  ];

  const navItems = userRole === "tenant" ? tenantNavItems : ownerNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-black border-t border-brand-yellow/20 z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-smooth",
                isActive 
                  ? "text-brand-yellow" 
                  : "text-white/70 active:text-brand-yellow"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-smooth",
                  isActive && "drop-shadow-glow"
                )} 
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
