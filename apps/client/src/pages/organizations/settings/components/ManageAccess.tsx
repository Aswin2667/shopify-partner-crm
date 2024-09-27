import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import DateHelper from "@/utils/DateHelper";
import { z } from "zod";
import OrganizationService from "@/services/OrganizationService";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const emailSchema = z.string().email({ message: "Invalid email address" });

const ManageAccess = () => {
  const [email, setEmail] = useState<string>("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const { organizationId } = useParams<{ organizationId: string }>();
  const userId = JSON.parse(localStorage.getItem("session") ?? "").id;
  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const response = await OrganizationService.getInvitations(organizationId);
      setPendingInvitations(response?.data.data.pendingInvitations || []);
      setMembers(response?.data.data.members || []);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [organizationId]);

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
    setInvitedEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };
  const { toast } = useToast();
  const {currentOrgMember} = useSelector((state: any) => state.organization)
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
        invitedBy: userId,
        emails: [...invitedEmails, email].filter(Boolean),
        role: "MEMBER",
        invite_sender_name: JSON.parse(localStorage.getItem("session") ?? "")
          .name,
        invite_sender_organization_name: currentOrgMember.name,
        Product_Name: "Shopify crm",
        action_url: "",
        name: "User",
      });
      if (response.status === 201) {
        toast({
          title: response.data.message,
          description: DateHelper.formatTimestamp(
            DateHelper.getCurrentUnixTime()
          ),
          duration: 1000,
          variant: `default`,
        });
      } else {
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
  const handleInputChange = (e: any) => {
    setEmail(e.target.value);
    setError(""); // Clear error when the user starts typing
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Invite People to this Organization</CardTitle>
          <CardDescription>
            Anyone with the link can join this organization
          </CardDescription>
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
        </CardHeader>
        <CardContent>
          {/* <div className="flex space-x-2">
            <Input value="http://example.com/link/to/document" readOnly />
            <Button variant="secondary" className="shrink-0">
              Copy Link
            </Button>
          </div> */}
          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-6 ">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {pendingInvitations.length === 0 && members.length === 0 ? (
                  <p>No invitations found.</p>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        People with access
                      </h4>{" "}
                      {members.map((member) => (
                        <div
                          key={member.user.email}
                          className="flex items-center justify-between space-x-4 p-0 m-2"
                        >
                          <div className="flex items-center space-x-4 p-0">
                            {/* TODO:  overflow-hidden -> overflow-scroll */}
                             <img src={member.user.avatarUrl} className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" referrerPolicy="no-referrer" alt="Avatar" />
                            <div>
                              <p className="text-sm font-medium leading-none p-0">
                                {member.user.name}
                              </p>
                              <p className="text-sm text-muted-foreground p-0">
                                {member.user.email}
                              </p>
                            </div>
                          </div>
                          <Select value={member.role}>
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="EDITOR">Editor</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">
                        Pending Invitations
                      </h5>
                      {pendingInvitations.map((invite) => (
                        <div
                          key={invite.email}
                          className="flex items-center justify-between space-x-4 m-2"
                        >
                          <div className="flex items-center space-x-4 p-0">
                            <Avatar>
                              <AvatarFallback>{invite.email[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none p-0">
                                {invite.email}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Pending
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAccess;
