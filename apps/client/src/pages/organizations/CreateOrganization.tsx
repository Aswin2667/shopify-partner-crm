import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import axios from "axios";

// Zod schema for validation
const organizationSchema = z.object({
  orgName: z.string().min(3, { message: "Organization name must be at least 3 characters" }),
  employeeCount: z.string(),
  logo: z.string().nullable(),
});

export default function CreateOrganization() {
  const [orgName, setOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [employeeCount, setEmployeeCount] = useState("1-5");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const organizationData = {
        orgName,
        employeeCount,
        logo: base64Image,
      };

      // Validate form data using Zod
      organizationSchema.parse(organizationData);
      console.log(organizationData);
      // Post data to the orgCreate URL
      await axios.post("http://localhost:3000/orgCreate", organizationData);

      // Show success notification
      // toast.success("Organization created successfully!");
      
      // Reset form
      setOrgName("");
      setEmployeeCount("1-5");
      setFilePreview(null);
      setSelectedFile(null);
      setBase64Image(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display validation errors
        // error.errors.forEach((err) => toast.error(err.message));
      } else {
        // Handle API errors
        // toast.error("Failed to create organization. Please try again.");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFilePreview(base64String);
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFilePreview(null);
    setSelectedFile(null);
    setBase64Image(null); 
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-3xl">
          <Building2 className="h-8 w-8 text-purple-600" />
          <span>Create an Organization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-base font-semibold">
              Organization name
            </Label>
            <Input
              id="orgName"
              placeholder="Your Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-sm text-gray-500">
              E.g. your company name or your workspace name.
            </p>
            {orgName.length > 0 && orgName.length < 3 && (
              <p className="text-sm text-red-500">
                Organization name must contain at least 3 characters
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgLogo" className="text-base font-semibold">
              Organization Logo
            </Label>
            <div className="flex items-center justify-center w-full">
              {!filePreview ? (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Number of Customers
            </Label>
            <RadioGroup
              value={employeeCount}
              onValueChange={setEmployeeCount}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              {["1-5", "6-49", "50-99", "100+"].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={value}
                    id={value}
                    className="border-gray-300 text-purple-600"
                  />
                  <Label htmlFor={value} className="text-sm text-gray-700">
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Organization</Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}