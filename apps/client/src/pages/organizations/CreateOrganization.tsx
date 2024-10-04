"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import OrganizationService from "@/services/OrganizationService";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const organizationSchema = z.object({
  orgName: z
    .string()
    .min(3, { message: "Organization name must be at least 3 characters" }),
  employeeCount: z.string(),
  logo: z.string({ message: "Logo is required" }),
  description: z
    .string()
    .max(500, { message: "Description must be 500 characters or less" })
    .optional(),
});

export default function CreateOrganization({
  reload,
  setReload,
  organization,
}: any) {
  const [orgName, setOrgName] = useState(organization?.organization?.name || "");
  const [description, setDescription] = useState(organization?.organization.description || "");
  const [employeeCount, setEmployeeCount] = useState( "1-5");
  const [filePreview, setFilePreview] = useState<string | null>(organization?.organization?.logo || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(organization?.organization?.logo || null);
  const { toast } = useToast();
  const userId = JSON.parse(localStorage.getItem("session") ?? "").id;

  const isUpdate = !!organization;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      organizationSchema.parse({
        orgName,
        description,
        employeeCount,
        logo: base64Image,
      });

      const data = {
        name: orgName,
        description,
        employeeCount,
        logo: base64Image,
      };

      const response = isUpdate
        ? "await OrganizationService.update({ ...data, userId, id: organization.id })"
        : await OrganizationService.create({ ...data, userId } as any);

      if (response.status) {
        toast({
          title: "Success",
          description: isUpdate
            ? "Organization updated successfully"
            : "Organization created successfully",
          variant: "default",
        });

        // Reset fields after success
        setOrgName("");
        setDescription("");
        setFilePreview(null);
        setSelectedFile(null);
        setBase64Image(null);

        setReload(!reload);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5 MB",
          variant: "destructive",
        });
        return;
      }

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-3xl">
          <Building2 className="h-8 w-8 text-purple-600" />
          <span>{isUpdate ? "Update Organization" : "Create an Organization"}</span>
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
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your organization (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={4}
            />
            <p className="text-sm text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgLogo" className="text-base font-semibold">
              Organization Logo
            </Label>
            <div className="flex items-center justify-center w-full">
              {!filePreview ? (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-[350px] h-[200px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-6">
                    <Upload className="w-5 h-5 mb-3 text-gray-400" />
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
                <div className="flex gap-5 items-center">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">
              {isUpdate ? "Update" : "Continue"}
            </AlertDialogAction>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
