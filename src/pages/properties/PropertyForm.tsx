import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  property_type: z.string().min(1, "Property type is required"),
  listing_type: z.string().min(1, "Listing type is required"),
  price: z.string().min(1, "Price is required"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  square_feet: z.string().optional(),
  year_built: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  virtual_tour_url: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: "draft",
      listing_type: "sale",
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      loadProperty(id);
    }
  }, [isEdit, id]);

  const loadProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_media(*)")
        .eq("id", propertyId)
        .single();

      if (error) throw error;

      // Populate form
      Object.keys(data).forEach((key) => {
        if (key !== "property_media" && data[key] !== null) {
          setValue(key as any, String(data[key]));
        }
      });

      // Load images
      if (data.property_media) {
        const imageUrls = data.property_media
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((media: any) => media.media_url);
        setImages(imageUrls);
      }
    } catch (error: any) {
      toast.error("Failed to load property");
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user?.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setImages([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);

    try {
      const propertyData: any = {
        title: data.title,
        description: data.description || null,
        address: data.address,
        city: data.city,
        state: data.state || null,
        zip_code: data.zip_code || null,
        property_type: data.property_type,
        listing_type: data.listing_type,
        status: data.status,
        virtual_tour_url: data.virtual_tour_url || null,
        price: parseFloat(data.price),
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        square_feet: data.square_feet ? parseInt(data.square_feet) : null,
        year_built: data.year_built ? parseInt(data.year_built) : null,
        created_by: user?.id,
      };

      let propertyId = id;

      if (isEdit) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", id);

        if (error) throw error;

        // Delete old media records
        await supabase.from("property_media").delete().eq("property_id", id);
      } else {
        // Create new property
        const { data: newProperty, error } = await supabase
          .from("properties")
          .insert([propertyData])
          .select()
          .single();

        if (error) throw error;
        propertyId = newProperty.id;
      }

      // Insert media records
      if (images.length > 0 && propertyId) {
        const mediaRecords = images.map((url, index) => ({
          property_id: propertyId,
          media_url: url,
          media_type: "image",
          display_order: index,
        }));

        const { error: mediaError } = await supabase
          .from("property_media")
          .insert(mediaRecords);

        if (mediaError) throw mediaError;
      }

      toast.success(isEdit ? "Property updated successfully" : "Property created successfully");
      navigate("/dashboard/properties");
    } catch (error: any) {
      toast.error(isEdit ? "Failed to update property" : "Failed to create property");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/properties")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Property" : "Add New Property"}</h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update property details" : "Fill in the property information"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input id="title" {...register("title")} placeholder="Luxury Villa with Ocean View" />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed property description..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select onValueChange={(value) => setValue("property_type", value)} value={watch("property_type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
                {errors.property_type && (
                  <p className="text-sm text-destructive mt-1">{errors.property_type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="listing_type">Listing Type *</Label>
                <Select onValueChange={(value) => setValue("listing_type", value)} value={watch("listing_type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input id="price" type="number" {...register("price")} placeholder="500000" />
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select onValueChange={(value) => setValue("status", value)} value={watch("status")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under_offer">Under Offer</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" {...register("address")} placeholder="123 Main Street" />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} placeholder="Los Angeles" />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="CA" />
              </div>

              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input id="zip_code" {...register("zip_code")} placeholder="90210" />
              </div>
            </div>
          </Card>

          {/* Property Details */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Property Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" {...register("bedrooms")} placeholder="3" />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" step="0.5" {...register("bathrooms")} placeholder="2.5" />
              </div>

              <div>
                <Label htmlFor="square_feet">Square Feet</Label>
                <Input id="square_feet" type="number" {...register("square_feet")} placeholder="2000" />
              </div>

              <div>
                <Label htmlFor="year_built">Year Built</Label>
                <Input id="year_built" type="number" {...register("year_built")} placeholder="2020" />
              </div>
            </div>

            <div>
              <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
              <Input id="virtual_tour_url" {...register("virtual_tour_url")} placeholder="https://..." />
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Property Images</h2>
              <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                <label className="cursor-pointer">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Images
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </Button>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No images uploaded yet</p>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="shadow-gold">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update Property" : "Create Property"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/properties")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PropertyForm;
