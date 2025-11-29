import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Bed,
  Bath,
  Maximize,
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColors = {
  draft: "bg-gray-500",
  active: "bg-green-500",
  under_offer: "bg-yellow-500",
  under_review: "bg-blue-500",
  sold: "bg-purple-500",
  leased: "bg-indigo-500",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);

      // Real-time subscription for property updates
      const channel = supabase
        .channel(`property-${id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "properties", filter: `id=eq.${id}` },
          () => loadProperty(id)
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "property_media", filter: `property_id=eq.${id}` },
          () => loadProperty(id)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_media!property_media_property_id_fkey(*),
          profiles!properties_created_by_fkey(full_name)
        `)
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error: any) {
      toast.error("Failed to load property details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      toast.success("Property deleted successfully");
      navigate("/dashboard/properties");
    } catch (error: any) {
      toast.error("Failed to delete property");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Property not found</h3>
          <Button onClick={() => navigate("/dashboard/properties")}>Back to Properties</Button>
        </Card>
      </DashboardLayout>
    );
  }

  const sortedImages = property.property_media
    ? [...property.property_media].sort((a, b) => a.display_order - b.display_order)
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/properties")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.address}, {property.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard/properties/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the property and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete Property"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Images Gallery */}
        {sortedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 relative h-96 rounded-xl overflow-hidden">
              <img
                src={sortedImages[0].media_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {sortedImages.slice(1, 5).map((media: any, index: number) => (
              <div key={media.id} className="relative h-48 rounded-xl overflow-hidden">
                <img src={media.media_url} alt={`${property.title} ${index + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">{formatPrice(property.price)}</h2>
                <Badge
                  className={`${statusColors[property.status as keyof typeof statusColors]} text-white`}
                >
                  {property.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5" />
                    <span>{property.square_feet.toLocaleString()} sq ft</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Built {property.year_built}</span>
                  </div>
                )}
              </div>

              {property.description && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing</span>
                  <span className="font-medium capitalize">{property.listing_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{property.status.replace("_", " ")}</span>
                </div>
                {property.lot_size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lot Size</span>
                    <span className="font-medium">{property.lot_size.toLocaleString()} sq ft</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-medium">{property.profiles?.full_name}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Location</h3>
              <div className="space-y-2 text-sm">
                <p>{property.address}</p>
                <p>{property.city}, {property.state} {property.zip_code}</p>
                <p>{property.country}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetail;
