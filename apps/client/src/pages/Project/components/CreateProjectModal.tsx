import { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProjectService from "@/services/ProjectService";

const projectSchema = z.object({
  name: z.string().min(1, "project name is required"),
  appId: z.string().min(1, "App ID is required"),
});

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<Boolean>>;
};

const CreateProjectModal: any = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log(open);
  const { currentIntegration } = useSelector((state: any) => state.integration);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  }: any = useForm({
    resolver: zodResolver(projectSchema),
  });

  const { mutate: createProject, isSuccess } = useMutation({
    mutationFn: async (data: any): Promise<any> =>
      await ProjectService.create(data),
    onSuccess: (response) => {
      reset();
      setOpen(false);
      console.log(response);
    },
    onError: (error: any) => {
      console.error("Login failed:", error?.response.data);
    },
  });

  const closeHandler = () => {
    reset();
    setOpen(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Connect Shopify</AlertDialogTitle>
          <AlertDialogDescription>
            Fill the following details to create an Shopify Integration
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={handleSubmit((data: any) =>
            createProject({
              name: data.name,
              type: "SHOPIFY",
              data: {
                appId: data.appId,
              },
              organizationId: currentIntegration?.organizationId,
              integrationId: currentIntegration?.id,
            }),
          )}
        >
          <div>
            {/* Connection Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Connection name
              </label>
              <input
                type="text"
                {...register("name")}
                className={`bg-gray-50 border ${errors.name ? "border-red-500 " : "border-gray-300"} focus-visible:outline-none focus-visible:border-none text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="e.g. Bonnie Green"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <br />

            {/* App ID */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                App ID
              </label>
              <input
                type="number"
                {...register("appId")}
                className={`bg-gray-50 border ${errors.appId ? "border-red-500 " : "border-gray-300"} focus-visible:outline-none focus-visible:border-none text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="e.g. 123456"
              />
              {errors.appId && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.appId.message}
                </p>
              )}
            </div>
            <br />
          </div>
          <br />
          <AlertDialogFooter>
            <Button type="button" variant="outline" onClick={closeHandler}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateProjectModal;
