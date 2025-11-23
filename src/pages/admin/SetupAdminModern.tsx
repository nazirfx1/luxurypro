import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SetupAdminModern = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the database function directly using Supabase RPC
      const { data, error } = await supabase.rpc('rpc_setup_initial_admin');

      if (error) {
        throw new Error(error.message || 'Failed to create admin user');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      setSuccess(true);
      console.log('Super Admin user created successfully!', data);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

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