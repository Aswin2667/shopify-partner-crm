import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import IntegrationInput, {
  IntegrationInputType,
} from "./type-inputs/IntegrationInput";
import { INTEGRATION_TYPES } from "../type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { shopifySchema } from "./type-inputs/ShopifyInput";
import { sendGridSchema } from "./type-inputs/SendGridInput";
import { mailGunSchema } from "./type-inputs/MailGunInput";

const baseSchema = z.object({
  name: z.string().min(1, "Integration name is required"),
  description: z.string().optional(),
});

const createDynamicSchema = (integrationType: string) => {
  switch (integrationType?.toUpperCase()) {
    case "SHOPIFY":
      return baseSchema.extend({ data: shopifySchema });
    case "SENDGRID":
      return baseSchema.extend({ data: sendGridSchema });
    case "MAILGUN":
      return baseSchema.extend({ data: mailGunSchema });
    default:
      return baseSchema.extend({ data: z.record(z.any()) });
  }
};

type CreateIntegrationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateIntegrationModal = ({
  open,
  setOpen,
}: CreateIntegrationModalProps) => {
  const navigate = useNavigate();
  const { organizationId, integrationType } = useParams();

  const dynamicSchema = createDynamicSchema(integrationType as string);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: "",
      description: "",
      data: {},
    },
    mode: "all",
  });

  const { mutate: connectIntegration } = useMutation({
    mutationFn: async (data: z.infer<typeof dynamicSchema>) =>
      await IntegrationService.connect(data),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      navigate(`/${organizationId}/settings/integration`);
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const closeHandler = () => {
    form.reset();
    setOpen(false);
  };

  function onSubmit(values: z.infer<typeof dynamicSchema>) {
    const IntegrationData = {
      ...values,
      type: INTEGRATION_TYPES[
        (
          integrationType as string
        )?.toUpperCase() as keyof typeof INTEGRATION_TYPES
      ],
      organizationId,
    };
    console.log(IntegrationData);
    connectIntegration(IntegrationData);
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create an Integration</AlertDialogTitle>
          <AlertDialogDescription>
            {`Fill in the details to create an ${integrationType} Integration.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. My Integration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. This integration is for..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <IntegrationInput
              type={integrationType?.toUpperCase() as IntegrationInputType}
              control={form.control}
            />

            <AlertDialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={closeHandler}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateIntegrationModal;
