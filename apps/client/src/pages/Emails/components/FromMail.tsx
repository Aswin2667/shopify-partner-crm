import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MailService from "@/services/MailService";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Type is required"),
  replyTo: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

const FromMail = () => {
  const { toast } = useToast();
  const { organizationId } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "",
      replyTo: "",
    },
  });

  const { sendAs } = useSelector((state: any) => state.mail);
  const { integrations, presentIntegrations } = useSelector(
    (state: any) => state.integration
  );

  const mailServiceIntegrations = integrations.filter(
    (integration: any) =>
      integration.category === "MAIL_SERVICE" && integration.isSingular
  );

  const { mutate: createFromEmail } = useMutation({
    mutationFn: async (data: any) => await MailService.createFromEmail(data),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
      form.reset();
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const { mutate: deleteFromEmail } = useMutation({
    mutationFn: async (id: string) => await MailService.deleteFromEmail(id),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
    },
    onError: (error: any) => {
      console.error("Deletion failed:", error?.response.data);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const integration = mailServiceIntegrations.find(
      (integration: any) => integration.type === values.type
    );

    const data = {
      fromName: values.name,
      fromEmail: values.email,
      type: values.type,
      replyTo: values.replyTo,
      integrationId: integration?.id || null,
      organizationId,
    };
    console.log(data);
    createFromEmail(data);
  }

  return (
    <div>
      <br />

      <h2 className="text-lg font-semibold mb-2">From Mail</h2>
      <Card>
        <div className="overflow-x-auto">
          {sendAs.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-center border-b">
                <tr>
                  <th scope="col" className="p-4">
                    Name
                  </th>
                  <th scope="col" className="p-4">
                    Email
                  </th>
                  <th scope="col" className="p-4">
                    Source
                  </th>
                  <th scope="col" className="p-4 ">
                    Reply To
                  </th>
                  <th scope="col" className="p-4 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sendAs.map((integration: any) => (
                  <tr
                    key={integration.id}
                    className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 "
                  >
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {integration.fromName}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {integration.fromEmail}
                    </td>
                    <td className="p-4 text-center">
                      <img
                        src={
                          presentIntegrations.find(
                            (i: any) => i.type === integration?.type
                          ).logo
                        }
                        alt={integration.type}
                        className="w-5 h-5 mx-auto"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {integration.replyTo ? integration.replyTo : "-"}
                    </td>
                    <td className="p-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 border"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`edit/${integration?.id}`}>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => deleteFromEmail(integration?.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center p-20">
              {`YOU HAVE NO FROM MAIL ACCOUNT(S) CONNECTED YET`}
            </div>
          )}
        </div>
      </Card>
      <br />

      <Card>
        <CardHeader>
          <CardTitle>From Email</CardTitle>
          <CardDescription>
            Add a new email address to send from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Mail Service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Mail Services</SelectLabel>
                          {mailServiceIntegrations.map((integration: any) => (
                            <SelectItem
                              key={integration.id}
                              value={integration.type}
                            >
                              {integration.type.split("_").join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bonnie Green" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. bonniegreen@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="replyTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reply To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. bonniegreen@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FromMail;
