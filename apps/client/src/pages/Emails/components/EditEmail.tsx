import { useState } from "react";
// import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

export default function EditEmailPage() {
  //   const router = useRouter();
  //   const { id } = router.query;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("connected");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log("Saving:", { email, status });
    // After saving, redirect back to the main page
    // router.push("/settings/from-mail");
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button
        variant="ghost"
        // onClick={() => router.push("/settings/from-mail")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to From Mail
      </Button>
      <h1 className="text-2xl font-bold mb-6">Edit Email</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </form>
    </div>
  );
}
