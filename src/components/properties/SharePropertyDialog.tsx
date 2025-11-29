import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Share2,
  Mail,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface SharePropertyDialogProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage?: string;
  trigger?: React.ReactNode;
}

export const SharePropertyDialog = ({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyImage,
  trigger,
}: SharePropertyDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: "",
    message: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  const propertyUrl = `${window.location.origin}/properties/${propertyId}`;
  const shareText = `Check out this property: ${propertyTitle} - $${propertyPrice.toLocaleString()}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      propertyUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      propertyUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareViaLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      propertyUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      `${shareText}\n${propertyUrl}`
    )}`;
    window.open(url, "_blank");
  };

  const shareViaEmail = async () => {
    if (!emailForm.recipientEmail) {
      toast.error("Please enter a recipient email");
      return;
    }

    setSendingEmail(true);
    try {
      // Using mailto for simplicity - you can replace this with an edge function for more control
      const subject = encodeURIComponent(`Property: ${propertyTitle}`);
      const body = encodeURIComponent(
        `${emailForm.message || shareText}\n\nView property: ${propertyUrl}`
      );
      window.location.href = `mailto:${emailForm.recipientEmail}?subject=${subject}&body=${body}`;
      
      toast.success("Email client opened!");
      setEmailForm({ recipientEmail: "", message: "" });
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Property</DialogTitle>
          <DialogDescription>
            Share this property with others via social media or email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex items-center gap-2">
              <Input
                value={propertyUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social Media Sharing */}
          <div className="space-y-2">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={shareViaFacebook}
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={shareViaTwitter}
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={shareViaLinkedIn}
              >
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={shareViaWhatsApp}
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Email Sharing */}
          <div className="space-y-3">
            <Label>Share via Email</Label>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Recipient's email"
                value={emailForm.recipientEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, recipientEmail: e.target.value })
                }
              />
              <Textarea
                placeholder="Add a personal message (optional)"
                value={emailForm.message}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, message: e.target.value })
                }
                rows={3}
              />
              <Button
                onClick={shareViaEmail}
                disabled={sendingEmail}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                {sendingEmail ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
