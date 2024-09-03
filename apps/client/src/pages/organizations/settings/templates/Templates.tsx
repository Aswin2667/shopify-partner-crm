import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import TemplateService from "@/services/TemplatesService";
import { useSelector } from "react-redux";
import ProfileHoverCard from "@/components/HoverCard";
import DateHelper from "@/utils/DateHelper";
import {followUpEmail, issueResolutionEmail, thankYouEmail} from  "../../../../lib/templates"
const defaultTemplates = [
  {
    id: "default-1",
    name: "Thank You Email",
    template: followUpEmail,
    isEnabled: true,
    createdAt: 0,
    userId: "system",
  },
  {
    id: "default-2",
    name: "Issue Resolution Email",
    template: issueResolutionEmail,
    isEnabled: true,
    createdAt: 0,
    userId: "system",
  },
  {
    id: "default-3",
    name: "Follow-Up Email",
    template: thankYouEmail,
    isEnabled: true,
    createdAt: 0,
    userId: "system",
  },
];
import { useToast } from "@/components/ui/use-toast"

const Templates = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentOrganization } = useSelector(
    (state: any) => state.organization
  );
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await TemplateService.getAllTemplatesByOrgId(
          currentOrganization.id
        );
        if (response.data.status) {
          const fetchedTemplates = response.data.data.map(
            (template: {
              id: string;
              name: string;
              html: string;
              isEnabled: boolean;
              createdAt: number;
              userId: string;
              user: any;
            }) => ({
              id: template.id,
              name: template.name,
              template: template.html,
              isEnabled: template.isEnabled,
              createdAt: template.createdAt,
              userId: template.userId,
              user: template.user,
            })
          );
          setTemplates([ ...fetchedTemplates, ...defaultTemplates]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [currentOrganization.id]);

  const handleTemplateClick = (template: string) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };
  const handleToggle = async (templateId: string, currentStatus: boolean) => {
    console.log("hello")
    try {
      const newStatus = !currentStatus;
      const response = await TemplateService.updateTemplateStatus(templateId, newStatus);

      if (response?.data.status) {
        // Update the local state with the new status
        setTemplates(prevTemplates =>
          prevTemplates.map(template =>
            template.id === templateId
              ? { ...template, isEnabled: newStatus }
              : template
          )
        );
        
      } else {
        
      }
    } catch (error) {
      console.error("Error updating template status:", error);
    }
  };
  return (
    <div className="overflow-x-auto">
      <Button
        type="button"
        onClick={() => navigate("../create-template")}
      >
        Add new Template
      </Button>
   <br />
   <br />
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200 max-h-[600px]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3">
              Created By
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.length > 0 && templates.map((template: any, index) => (
            <tr
              key={template.id || index}
              className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <th
                scope="row"
                onClick={() => handleTemplateClick(template.template)}
                className="flex hover:underline hover:text-blue-600 hover:dark:text-blue-600 hover:cursor-pointer items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {template.name}
              </th>
              <td className="px-4 py-2">
                <Switch checked={template.isEnabled} onCheckedChange={() => handleToggle(template.id, template.isEnabled)} />
              </td>
              <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {template.userId === "system" ? (
                  "System"
                ) : (
                  <ProfileHoverCard user={template.user} />
                )}
              </td>
              <td className="px-4 py-2 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                {template.createdAt===0? "N\A" : DateHelper.formatTimestamp(template.createdAt)??""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Template Preview
            </h2>
            <div className="max-h-96 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate }} />
            </div>
            <div className="flex items-center min-w-full justify-end">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;