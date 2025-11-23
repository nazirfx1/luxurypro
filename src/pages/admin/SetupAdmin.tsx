import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const SetupAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        'https://rgeremeauvsvfhplfeqr.supabase.co/functions/v1/create-admin-user',
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
            role: 'admin',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      setSuccess(true);
      toast.success('Admin user created successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Admin User Setup</h1>
          <p className="text-muted-foreground text-sm">
            Click the button below to create the admin user
          </p>
        </div>

        {!success ? (
          <form onSubmit={createAdminUser} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value="nazirfxone@gmail.com" disabled />
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input value="Nazir Ismail" disabled />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Admin" disabled />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Admin User
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Admin user has been created successfully.
              </p>
              <div className="bg-muted p-4 rounded-lg text-left space-y-2 text-sm">
                <p><strong>Email:</strong> nazirfxone@gmail.com</p>
                <p><strong>Password:</strong> hacksom-1212</p>
                <p><strong>Role:</strong> Admin</p>
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

export default SetupAdmin;
