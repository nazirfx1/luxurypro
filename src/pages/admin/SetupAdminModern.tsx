import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SetupAdminModern = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Check if admin setup is needed
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        // Check if setup is already complete
        const { data: setupData, error: setupError } = await supabase
          .from('admin_setup')
          .select('is_setup_complete')
          .single();

        if (setupError) {
          console.error('Setup check error:', setupError);
          setSetupNeeded(true);
          return;
        }

        if (setupData?.is_setup_complete) {
          setSetupNeeded(false);
        } else {
          // Check if any admin users already exist
          const { data: adminRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .in('role', ['super_admin', 'admin']);

          if (rolesError) {
            console.error('Roles check error:', rolesError);
          }

          setSetupNeeded(!adminRoles || adminRoles.length === 0);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
        setSetupNeeded(true);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetupStatus();
  }, []);

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': 'create-admin-user-secret-2024',
          },
          body: JSON.stringify({
            email: 'nazirfxone@gmail.com',
            password: 'hacksom-1212',
            full_name: 'Nazir Ismail',
            role: 'super_admin',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      setSuccess(true);
      console.log('Super Admin user created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking setup status...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!setupNeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🔒</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Setup Already Complete</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Admin setup has already been completed for this system.
              </p>
              <Button
                className="w-full"
                onClick={() => window.location.href = '/auth'}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Super Admin Setup</h1>
          <p className="text-muted-foreground text-sm">
            Click the button below to create the super admin user
          </p>
        </div>

        {!success ? (
          <form onSubmit={createAdminUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                value="nazirfxone@gmail.com" 
                disabled 
                className="w-full px-3 py-2 border border-border rounded-md bg-muted"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input 
                value="Nazir Ismail" 
                disabled 
                className="w-full px-3 py-2 border border-border rounded-md bg-muted"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <input 
                value="Super Admin" 
                disabled 
                className="w-full px-3 py-2 border border-border rounded-md bg-muted"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Super Admin User"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Super Admin user has been created successfully.
              </p>
              <div className="bg-muted p-4 rounded-lg text-left space-y-2 text-sm">
                <p><strong>Email:</strong> nazirfxone@gmail.com</p>
                <p><strong>Password:</strong> hacksom-1212</p>
                <p><strong>Role:</strong> Super Admin</p>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => window.location.href = '/auth'}
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SetupAdminModern;