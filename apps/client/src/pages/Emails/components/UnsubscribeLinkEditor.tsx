import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Copy } from "lucide-react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UnsubscribeLinkService from "@/services/UnSubscribeLinkService";
import { Link, useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  anchorText: z.string().min(1, "Anchor text is required"),
});

export default function UnsubscribeLinkEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { unsubscribeLinkId, organizationId } = useParams();

  const isNew = unsubscribeLinkId === "new";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      anchorText: "",
    },
  });

  const { unsubscribeLinks } = useSelector((state: any) => state.organization);

  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      await UnsubscribeLinkService.create(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: ["getUnsubscribeLinks", organizationId],
      });
      navigate(`..`);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const unsubscribeLink = {
      id: isNew ? "1" : unsubscribeLinkId,
      ...values,
      organizationId: organizationId,
    };

    console.log(unsubscribeLink);
    mutate(unsubscribeLink);
  }

  useEffect(() => {
    if (unsubscribeLinkId && !isNew) {
      const unsubscribeLink = unsubscribeLinks.find(
        (link: any) => link.id === unsubscribeLinkId
      );
      if (unsubscribeLink?.id) {
        // form.setValue("name", unsubscribeLink.name);
        // form.setValue("message", unsubscribeLink.message);
        // form.setValue("anchorText", unsubscribeLink.anchorText);
        form.reset({
          name: unsubscribeLink.name,
          message: unsubscribeLink.message,
          anchorText: unsubscribeLink.anchorText,
        });
      }
    }
  }, [unsubscribeLinkId, unsubscribeLinks, isNew, form]);

  return (
    <div className="w-full mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        {/* Breadcrumb */}
        <div className="border-b p-5 w-full">
          <Link
            to=".."
            className="flex items-center gap-1 text-sm text-[#767676] hover:text-gray-800 w-fit"
          >
            <TbArrowNarrowLeft size={20} />
            <h6>{`${isNew ? "New" : "Edit"} Unsubscribe Links`}</h6>
          </Link>
          <h1 className="text-2xl font-medium">
            {form.watch("name") || "New Unsubscribe Link"}
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
          <Button onClick={form.handleSubmit(onSubmit)}>
            {isNew ? "Save" : "Update"}
          </Button>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Default Unsubscribe Link" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a name for this unsubscribe link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unsubscribe Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="To stop receiving these emails,"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the message to be displayed with the unsubscribe link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anchorText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anchor Text</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Click here" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the text to be displayed for the unsubscribe link.
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
