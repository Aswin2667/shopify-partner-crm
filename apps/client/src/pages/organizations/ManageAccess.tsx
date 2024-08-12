import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import OrganizationService from "@/services/OrganizationService";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";

const emailSchema = z.string().email({ message: "Invalid email address" });

const ManageAccess = () => {
  const [email, setEmail] = useState<string>("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { organizationId } = useParams<{ organizationId: string }>();
  console.log(organizationId);
  const userId = JSON.parse(sessionStorage.getItem("session")??"").id;
  const handleInputChange = (e: any) => {
    setEmail(e.target.value);
    setError(""); // Clear error when the user starts typing
  };

  const handleInvite = () => {
    try {
      emailSchema.parse(email); // Validate email using Zod

      if (invitedEmails.includes(email)) {
        setError("This email has already been invited.");
      } else {
        setInvitedEmails((prevEmails) => [...prevEmails, email]);
        setEmail(""); // Clear the input after adding
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message); // Set validation error
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleInvite();
    }
  };

  const removeEmail = (index: number) => {
    setInvitedEmails((prevEmails) =>
      prevEmails.filter((_, i) => i !== index)
    );
  };
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    try {
      // emailSchema.parse(email); 
  
      if (email && !invitedEmails.includes(email)) {
        setInvitedEmails((prevEmails) => [...prevEmails, email]);
      }
        if (invitedEmails.length === 0 && !email) {
        setError("Please invite at least one email before submitting.");
        return;
      }
  
     const response = await OrganizationService.invite({
        organizationId,
        invitedBy:userId,
        emails: [...invitedEmails, email].filter(Boolean), 
        role: "MEMBER",
        invite_sender_name: JSON.parse(sessionStorage.getItem("session")??"").name,
        invite_sender_organization_name:"Retainful",
        Product_Name:"Shopify crm",
        action_url:"https://www.retainful.com",
        name:"User"
      });
      if(response.status === 201){
        toast({
          title: response.data.message,
          description: DateHelper.formatTimestamp(
            DateHelper.getCurrentUnixTime()
          ),
          duration: 1000,
          variant: `default`,
        });
      }else{
        toast({
          title: response.data.message,
          description: DateHelper.formatTimestamp(
            DateHelper.getCurrentUnixTime()
          ),
          duration: 1000,
          variant: `destructive`,
        });
      }
      setInvitedEmails([]);
      setEmail("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message); // Set validation error
      } else {
        setError("Failed to send invites. Please try again.");
      }
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col items-start space-y-4">
        <div className="box-border flex-wrap gap-3">
          {invitedEmails.length > 0 && (
            <div className="w-full">
              {invitedEmails.map((invitedEmail, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                >
                  {invitedEmail}
                  <button
                    type="button"
                    className="inline-flex items-center p-1 ms-2 text-sm text-red-800 bg-transparent rounded-sm hover:bg-red-200 hover:text-green-900 dark:hover:text-red-300"
                    onClick={() => removeEmail(index)}
                    aria-label="Remove"
                  >
                    <svg
                      className="w-2 h-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Remove badge</span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            value={email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="focus-visible:outline-none focus-visible:border-none"
            placeholder="Email"
          />
          <Button type="button" onClick={handleSubmit}>
            Invite
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
      <br />
      <ul className="max-w-[700px] divide-y divide-gray-200 dark:divide-gray-700">
        <li className="p-2">
          <div className="flex items-center max-h-[100px] space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0 p-0">
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-1.jpg"
                alt="Neil image"
              />
            </div>
            <div className="flex-1 min-w-0 p-0">
              <p className="text-sm font-medium p-0 text-gray-900 truncate dark:text-white">
                Neil Sims
              </p>
              <p className="text-sm text-gray-500 p-0 truncate dark:text-gray-400">
                email@flowbite.com
              </p>
            </div>
            <div className="inline-flex items-center p-0 text-base font-semibold text-gray-900 dark:text-white">
              <div className="grid gap-3">
                <label htmlFor="role">Role</label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ManageAccess;
