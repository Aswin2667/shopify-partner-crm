import React from "react";
import {
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
// import {
//   TooltipProvider,
//   TooltipTrigger,
//   TooltipContent,
// } from "@radix-ui/react-tooltip";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  partnerId: z.string().min(1, "Partner ID is required"),
  accessToken: z.string().min(1, "Access token is required"),
  description: z.string().min(1, "Description is required"),
});

const CreateShopifyModal: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  }: any = useForm({
    resolver: zodResolver(organizationSchema),
  });
  // const userId = JSON.parse(sessionStorage.getItem("session") ?? "").id;
  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Connect Shopify</AlertDialogTitle>
        <AlertDialogDescription>
          Fill the following details to create an Shopify Integration
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
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
          
          {/* Partner ID */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Partner ID
            </label>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover</Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="start"
                className="bg-gray-800"
              >
                <p className="text-sm">Add to library</p>
              </TooltipContent>
            </Tooltip> */}
            <input
              type="number"
              {...register("partnerId")}
              className={`bg-gray-50 border ${errors.partnerId ? "border-red-500 " : "border-gray-300"} focus-visible:outline-none focus-visible:border-none text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="e.g. 123456"
            />
            {errors.partnerId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.partnerId.message}
              </p>
            )}
          </div>
          <br />

          {/* Access Token */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Access Token
            </label>
            <input
              type="text"
              {...register("accessToken")}
              className={`bg-gray-50 border ${errors.accessToken ? "border-red-500 " : "border-gray-300"} focus-visible:outline-none focus-visible:border-none text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="e.g. prtapi_abcdef123456"
            />
            {errors.accessToken && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.accessToken.message}
              </p>
            )}
          </div>
          <br />

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              {...register("description")}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Description"
            ></textarea>
          </div>
          <br />
        </div>
        <br />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <Button type="submit">Create</Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  );
};

export default CreateShopifyModal;
