import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import MailService from "@/services/MailService";
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
import { Link, useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  fromName: z.string().min(1, "From Name is required"),
  fromEmail: z.string().email("Invalid email address"),
  replyTo: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

export default function SendAsEditor() {
  const navigate = useNavigate();
  const { sendAsId, organizationId } = useParams();
  const [type, setType] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromName: "",
      fromEmail: "",
      replyTo: "",
    },
  });

  const { sendAs: sendAsList } = useSelector((state: any) => state.mail);

  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      await MailService.updateFromEmail(data),
    onSuccess: (response) => {
      console.log(response);
      navigate("..");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      id: sendAsId,
      ...values,
      organizationId: organizationId,
      type,
    };

    console.log(data);
    mutate(data);
  }

  useEffect(() => {
    if (sendAsId) {
      const sendAs = sendAsList.find((sendAs: any) => sendAs.id === sendAsId);
      if (sendAs?.id) {
        form.reset({
          fromName: sendAs.fromName,
          fromEmail: sendAs.fromEmail,
          replyTo: sendAs.replyTo,
        });
        setType(sendAs.type);
      }
    }
  }, [sendAsId, sendAsList, form]);

  return (
    <div className="w-full mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="border-b p-5 w-full">
          <Link
            to=".."
            className="flex items-center gap-1 text-sm text-[#767676] hover:text-gray-800 w-fit"
          >
            <TbArrowNarrowLeft size={20} />
            <h6 className="">Edit Send As Details</h6>
          </Link>
          <h1 className="text-2xl font-medium">
            {form.watch("fromName") || "New Send As"}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={() => navigate("..")}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={type === "GMAIL" || !form.watch("fromName")}
          >
            Update
          </Button>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fromName"
            disabled={type === "GMAIL"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter From Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fromEmail"
            disabled={type === "GMAIL"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter From Email" {...field} />
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
                  <Input placeholder="Enter Reply To Email" {...field} />
                </FormControl>
                <FormDescription>
                  Leave blank to use the From Email as the Reply To address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
