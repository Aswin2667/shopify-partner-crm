import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ProjectService from "@/services/ProjectService";

import ProjectInput from "./type-input/ProjectInput";
import { shopifySchema } from "./type-input/ShopifyInput";

const baseSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

const createDynamicSchema = (integrationType: string) => {
  switch (integrationType) {
    case "SHOPIFY":
      return baseSchema.extend({ data: shopifySchema });
    default:
      return baseSchema.extend({ data: z.record(z.any()) });
  }
};

const ProjectForm = ({
  handleTabChange,
}: {
  handleTabChange: (tab: string) => void;
}) => {
  const queryClient = useQueryClient();
  const { integrationType, organizationId } = useParams();

  const integration = useSelector(
    (state: any) => state.integration.integrations
  ).find((integration: any) => integration.type === integrationType);

  const dynamicSchema = createDynamicSchema(integrationType as string);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: "",
      data: {},
    },
  });

  const { mutate: createProject } = useMutation({
    mutationFn: async (data: z.infer<typeof dynamicSchema>) =>
      await ProjectService.create(data),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["getAllProjects", organizationId],
      });
      handleTabChange("projectsList");
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const onSubmit = (values: z.infer<typeof dynamicSchema>) => {
    const projectData = {
      ...values,
      type: integration.type,
      organizationId,
      integrationId: integration.id,
    };
    console.log(projectData);
    createProject(projectData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Project</CardTitle>
        <CardDescription>
          Fill in the details to create a project.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bonnie Green" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProjectInput control={form.control} type={integration.type} />
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProjectForm;
