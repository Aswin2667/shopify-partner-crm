import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ContactService from "@/services/ContactService";

export default function UnsubscribePage() {
  const { contactId } = useParams();
  const [unsubscribe, setUnsubscribe] = useState(false);

  const { mutate: unSubscribeContact } = useMutation({
    mutationFn: async () => await ContactService.unSubscribeContact(contactId),
    onSuccess: () => {
      console.log("User unsubscribed");
      toast({
        title: "Unsubscribe successful",
        description: "You have been unsubscribed from all emails.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while unsubscribing from emails.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unsubscribe) {
      // Here you would typically send this data to your backend
      unSubscribeContact();
    } else {
      toast({
        title: "No change",
        description: "You are still subscribed to our emails.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 mt-60">
      <header>
        <h1 className="text-2xl font-bold">Unsubscribe from Emails</h1>
        <p className="text-muted-foreground mt-2">
          We're sorry to see you go. Uncheck the box below to unsubscribe from
          all emails.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="subscribe"
            checked={!unsubscribe}
            onCheckedChange={(checked) => setUnsubscribe(!checked)}
          />
          <label
            htmlFor="subscribe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Receive emails from us
          </label>
        </div>

        <Button type="submit" className="w-full">
          Update Preferences
        </Button>
      </form>
    </div>
  );
}
