import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Check, Clock } from "lucide-react";
import { format } from "date-fns";

interface BookVisitDialogProps {
  propertyId: string;
  propertyTitle: string;
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const BookVisitDialog = ({ propertyId, propertyTitle }: BookVisitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const handleSubmit = async () => {
    if (!date || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("property_visits")
        .insert({
          property_id: propertyId,
          visitor_name: formData.name,
          visitor_email: formData.email,
          visitor_phone: formData.phone,
          visit_date: format(date, "yyyy-MM-dd"),
          visit_time: selectedTime,
          message: formData.message,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setConfirmationNumber(data.id.substring(0, 8).toUpperCase());
      setStep(4);
      toast.success("Visit booked successfully!");
    } catch (error: any) {
      toast.error("Failed to book visit");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setDate(undefined);
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setConfirmationNumber("");
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 text-base">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Schedule a Visit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 4 ? "Booking Confirmed" : `Book a Visit - Step ${step} of 3`}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label className="mb-2 block">Select Time</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="h-10"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!date || !selectedTime}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{date && format(date, "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{selectedTime}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any special requirements?"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Review
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="glass-effect p-6 rounded-xl space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Property</h4>
                <p className="text-sm text-muted-foreground">{propertyTitle}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Visit Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Date: {date && format(date, "MMMM dd, yyyy")}</p>
                  <p>Time: {selectedTime}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Your Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Name: {formData.name}</p>
                  <p>Email: {formData.email}</p>
                  <p>Phone: {formData.phone}</p>
                  {formData.message && <p>Message: {formData.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              Your visit has been scheduled successfully
            </p>
            <div className="glass-effect p-6 rounded-xl space-y-2">
              <p className="text-sm text-muted-foreground">Confirmation Number</p>
              <p className="text-2xl font-bold text-primary">{confirmationNumber}</p>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{date && format(date, "MMMM dd, yyyy")} at {selectedTime}</p>
              <p>{propertyTitle}</p>
            </div>
            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookVisitDialog;
