import { Separator } from "@/components/ui/separator";
import EmailEditor from "@/pages/leads/components/EmailEditor";
import React, { useState } from "react";
import axios from "axios"; // Make sure axios is installed
import axiosInstance from "@/utils/_axios";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import TemplateService from "@/services/TemplatesService";
import { useToast } from "@/components/ui/use-toast"
  
const TemplateCreatePage = () => {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("session") ?? "").id;
  const { toast } = useToast()
   const { currentOrgMember } = useSelector(
    (state: any) => state.organization,
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
       const response = await TemplateService.create({
        name,
        html: data,
        userId,
        orgId:currentOrgMember.id
      })
      toast({
        title: "Template created successfully",
      })

      // Handle success
      console.log("Template created:", response.data);
      // Optionally, navigate to another page or show a success message
    } catch (error) {
      // Handle error
      console.error("Error creating template:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Ex. Welcome Email"
            required
          />
        </div>
        <br />
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <EmailEditor value={data} setValue={setData} />
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TemplateCreatePage;
