import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";

const NewMaintenanceRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    property_id: "",
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    loadUserProperties();
  }, [user]);

  const loadUserProperties = async () => {
    try {
      const { data: leases } = await supabase
        .from("leases")
        .select("property_id, properties(id, title, address)")
        .eq("tenant_id", user?.id)
        .eq("status", "active");

      if (leases) {
        const uniqueProperties = Array.from(
          new Map(leases.map(l => [l.properties.id, l.properties])).values()
        );
        setProperties(uniqueProperties);
        if (uniqueProperties.length === 1) {
          setFormData(prev => ({ ...prev, property_id: uniqueProperties[0].id }));
        }
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.property_id || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: request, error } = await supabase
        .from("maintenance_requests")
        .insert({
          ...formData,
          tenant_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Upload images if any
      if (images.length > 0 && request) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${request.id}/${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, image);

          if (!uploadError) {
            await supabase
              .from("maintenance_media")
              .insert({
                request_id: request.id,
                media_url: fileName,
                media_type: 'image',
              });
          }
        }
      }

      toast.success("Maintenance request submitted successfully");
      navigate("/dashboard/maintenance");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit maintenance request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="New Maintenance Request" 
        description="Submit a new maintenance request for your property"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Maintenance", href: "/dashboard/maintenance" },
          { label: "New Request" }
        ]}
      />

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="property">Property *</Label>
            <Select
              value={formData.property_id}
              onValueChange={(value) => setFormData({ ...formData, property_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Leaking faucet in kitchen"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="appliance">Appliance</SelectItem>
                <SelectItem value="structural">Structural</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed description of the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </span>
              </label>
              {images.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {images.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/maintenance")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default NewMaintenanceRequest;
