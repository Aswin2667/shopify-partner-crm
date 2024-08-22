import React, { useState } from "react";
import { Plus, Save, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OpurtunityExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
    notes: "",
  });

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactDetails({
      ...contactDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Contact saved:", contactDetails);
    // Implement save logic here
  };

  const handleDelete = () => {
    console.log("Contact deleted");
    // Implement delete logic here
  };

  return (

    <Card className="border-0 p-1 shadow-none">
      <CardHeader className="flex justify-between p-0 rounded-sm items-center bg-muted/50">
      <CardTitle className="min-w-full text-lg flex p-1  justify-between items-center">
          <div>Contact Details<span className="inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">4</span></div>
          <div className="flex items-center gap-1 border-l-2 pl-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={handleExpand}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Edit Contact</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-6">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input
                name="email"
                value={contactDetails.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <Input
                name="phone"
                value={contactDetails.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <Textarea
                name="notes"
                value={contactDetails.notes}
                onChange={handleInputChange}
              />
            </div>
            <Button variant="outline" className="mt-4" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Contact
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
