import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LeadService from "@/services/LeadService";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { useState } from "react";

const schema = z.object({
  myShopifyDomain: z
    .string()
    .min(1, "Domain is required")
    .regex(/\.myshopify\.com$/, "Domain must end with .myshopify.com"),
  status: z.enum([
    "POTENTIAL",
    "CUSTOMER",
    "INTERESTED",
    "NOT_INTERESTED",
    "BAD_FIT",
    "QUALIFIED",
    "CANCELED",
  ]),
  description: z.string().optional(),
});

// TODO: Remove this cOMPONENT
export function DataTableToolbar({ leads }: any) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  }: any = useForm({
    resolver: zodResolver(schema),
  });

  const userId = JSON.parse(localStorage.getItem("session") ?? "").id;
  const { toast } = useToast();
  const { currentOrgMember } = useSelector(
    (state: any) => state.organization
  );
  const { currentIntegration } = useSelector((state: any) => state.integration);

  const onSubmit = async (data: any) => {
    console.log("Form Data:", currentOrgMember?.id);
    const response = await LeadService.create({
      ...data,
      userId,
      organizationId: currentOrgMember?.id,
      integrationId: currentIntegration?.id,
    });

    if (response.data.status) {
      toast({
        title: "Lead Created",
        description: "Lead created successfully",
        variant: "default",
        duration: 3000,
      });
      setOpen(false);
      reset();
    } else {
      toast({
        title: "Error while creating lead",
        description: response.data.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex items-center flex-1 space-x-4">
          <h5>
            <span className="text-gray-500">All Leads: </span>
            <span className="dark:text-white">{leads.length}</span>
          </h5>
          <h5>
            <span className="text-gray-500">Total Revenue: </span>
            <span className="dark:text-white"> $88.4k</span>
          </h5>
        </div>
        <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
          <AlertDialogTrigger>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium dark:text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add new Lead
            </button>
          </AlertDialogTrigger>
          <button
            type="button"
            className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Sync changes
          </button>
          <button
            type="button"
            className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Lead</AlertDialogTitle>
          <Separator />
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="myShopifyDomain"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Lead Domain
              </label>
              <input
                type="text"
                {...register("myShopifyDomain")}
                id="myShopifyDomain"
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.myShopifyDomain ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="test.myshopify.com"
              />
              {errors.myShopifyDomain && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.myShopifyDomain.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <select
                {...register("status")}
                id="status"
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="POTENTIAL">POTENTIAL</option>
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT_INTERESTED">NOT INTERESTED</option>
                <option value="BAD_FIT">BAD FIT</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="CANCELED">CANCELED</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter a brief description"
              />
            </div>
          </div>
          <Separator />
          <br />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit">Create Lead</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
