import { Separator } from "@/components/ui/separator";
import EmailEditor from "@/pages/leads/components/EmailEditor";
import React, { useState } from "react";
import axios from "axios"; // Make sure axios is installed
import axiosInstance from "@/utils/_axios";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import TemplateService from "@/services/TemplatesService";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TbArrowNarrowLeft } from "react-icons/tb";

const shortcodes = [
  { code: "{{name}}", description: "Recipient's name" },
  { code: "{{email}}", description: "Recipient's email" },
  { code: "{{shopify_domain}}", description: "Shopify domain" },
  // { code: "{{company}}", description: "Recipient's company" },
  // { code: "{{unsubscribe_link}}", description: "Unsubscribe link" },
  // { code: "{{current_date}}", description: "Current date" },
];

const TemplateCreatePage = () => {
  const { toast } = useToast();
  const { organizationId } = useParams();

  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // const userId = JSON.parse(localStorage.getItem("session") ?? "").id;
  const { currentOrgMember } = useSelector((state: any) => state.organization);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await TemplateService.create({
        name,
        html: data,
        userId: currentOrgMember.userId,
        orgId: organizationId,
      });
      toast({
        title: "Template created successfully",
      });

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${text} has been copied to your clipboard.`,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Breadcrumb */}
      <div className="border-b p-5 w-full">
        <Link
          to="../templates"
          className="flex items-center gap-1 text-sm text-[#767676]
          hover:text-gray-800 w-fit"
        >
          <TbArrowNarrowLeft size={20} />

          <h6 className="">Templates</h6>
        </Link>
        <h1 className="text-2xl font-medium">Create Template</h1>
      </div>
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
        <Separator className="my-8" />

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Available Shortcodes
          </h3>
          <ul className="space-y-4">
            {shortcodes.map((shortcode) => (
              <li
                key={shortcode.code}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex-shrink-0  w-1/3">
                  <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded text-sm">
                    {shortcode.code}
                  </code>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 w-1/3">
                  {shortcode.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shortcode.code)}
                  className="flex items-center space-x-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default TemplateCreatePage;
