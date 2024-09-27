import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GmailIcon from "../../../../../assets/gmail.png";
import DateHelper from "@/utils/DateHelper";
import { PiCheckCircleDuotone } from "react-icons/pi";
import { Mail, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MailService from "@/services/MailService";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Must be a valid email." }),
});

type Props = {};

const Index = (props: Props) => {
  const { toast } = useToast();
  const { organizationId, integrationType } = useParams();

  const [activeTab, setActiveTab] = useState("connectedAccounts");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { integrations, presentIntegrations } = useSelector(
    (state: any) => state.integration
  );

  const selectedIntegration = presentIntegrations.find(
    (integration: any) => integration.type === integrationType
  );

  const integration = selectedIntegration.singular
    ? integrations.find(
        (integration: any) => integration.type === integrationType
      )
    : integrations.filter(
        (integration: any) => integration.type === integrationType
      );

  const fromMails = selectedIntegration.singular
    ? integration.mailServiceFromEmail
    : integration
      ? integration.flatMap(
          (integration: any) => integration.mailServiceFromEmail
        )
      : [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      type: integrationType,
      integrationId: integration?.id || null,
      organizationId,
    };
    console.log(data);
    createFromEmail(data);
  }

  const { mutate: createFromEmail } = useMutation({
    mutationFn: async (data: any) => await MailService.createFromEmail(data),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const { mutate: deleteIntegration } = useMutation({
    mutationFn: async (id) => await IntegrationService.delete(id),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connectedAccounts">
            Connected Accounts
          </TabsTrigger>
          <TabsTrigger value="addAccount">Add Account</TabsTrigger>
        </TabsList>
        <TabsContent value="connectedAccounts">
          <Card>
            <div className="overflow-x-auto">
              {fromMails.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-center border-b">
                    <tr>
                      <th scope="col" className="p-4">
                        Email
                      </th>
                      <th scope="col" className="p-4">
                        Status
                      </th>
                      <th scope="col" className="p-4">
                        Actions
                      </th>
                      <th scope="col" className="p-4 text-center">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromMails.map((integration: any) => {
                      return (
                        <tr className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ">
                          <td
                            scope="row"
                            className="flex items-center p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white justify-center"
                          >
                            <img
                              src={selectedIntegration.logo}
                              alt="asd"
                              className="w-5 h-5 mr-3"
                            />
                            <span className="hover:underline hover:text-blue-600 hover:dark:text-blue-600 hover:cursor-pointer">
                              {integration.fromEmail}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <PiCheckCircleDuotone
                                size={24}
                                className="text-green-500"
                              />
                              <span>Connected</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <button
                              className="flex items-center mx-auto"
                              onClick={() => deleteIntegration(integration?.id)}
                            >
                              <Trash2 className="" />
                            </button>
                          </td>
                          <td className="p-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                            {DateHelper.formatTimestamp(integration.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex justify-center items-center p-20">
                  {`YOU HAVE NO ${integrationType?.split(/[^a-zA-Z0-9]+/).join(" ")} MAIL ACCOUNT(S) CONNECTED YET`}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="addAccount">
          {integrationType === "GMAIL" ? (
            <div>
              You are only allowed to use your Gmail's ID for the Email Sending
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>From Email</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dinesh Balan S" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your from display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="dineshbalan@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your from email address.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      {/* <h1 className="uppercase">Connected {integrationType} Accounts</h1> */}
    </div>
  );
};

export default Index;
