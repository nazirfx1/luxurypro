import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  property_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  status: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  properties: {
    title: string;
    city: string;
    state: string;
  };
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();

    // Realtime subscription
    const channel = supabase
      .channel("bookings-management")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        fetchBookings
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        properties (
          title,
          city,
          state
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to update booking status");
    } else {
      toast.success(`Booking ${status}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage property booking requests
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bookings yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {booking.properties.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {booking.properties.city}, {booking.properties.state}
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{booking.visitor_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.visitor_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.visitor_phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(booking.start_date).toLocaleDateString()}
                          {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Requested: {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        className="flex-1"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      className="w-full"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingsManagement;
