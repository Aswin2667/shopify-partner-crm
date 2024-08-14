import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  AlertDialog,
  AlertDialogAction,
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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const schema = z.object({
  myShopifyDomain: z
    .string()
    .min(1, "Domain is required")
    .regex(/\.myshopify\.com$/, "Domain must end with .myshopify.com"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  }: any = useForm({
    resolver: zodResolver(schema),
  });
    const userId = JSON.parse(sessionStorage.getItem('session')??"").id
    const {toast} = useToast() 
  const onSubmit = async (data: any) => {
    console.log(data);
    const response = await LeadService.create({...data,userId})
    if(response.data.status){
      toast(
        {
          title: "Lead Created",
          description: "Lead created successfully",
          variant: "default",
          duration: 3000,
        }
      )
    }else{
      toast(
        {
          title: "Error while creating lead",
          description: response.data.message,
          variant: "destructive" ,
          duration: 3000,
        }
      )
    }
    console.log(response.data)
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant={"outline"} className="h-8 px-2 lg:px-3">
              Create Lead
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>New Lead</AlertDialogTitle>
              <Separator />
            </AlertDialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="min-w-full flex flex-col gap-5 mx-auto"
              noValidate
            >
              {errors.myShopifyDomain ? (
                <div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      name="myShopifyDomain"
                      id="myShopifyDomain"
                      {...register("myShopifyDomain")}
                      aria-describedby="standard_error_help"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-red-600 appearance-none dark:text-white dark:border-red-500 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="standard_error"
                      className="absolute text-sm text-red-600 dark:text-red-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                    >
                      MyShopifyDomain
                    </label>
                  </div>
                  <p
                    id="standard_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    <span className="font-medium">Oh, snapp!</span>{" "}
                    {errors.myShopifyDomain.message}
                  </p>
                </div>
              ) : (
                <div className="relative z-0">
                  <input
                    type="text"
                    name="myShopifyDomain"
                    id="myShopifyDomain"
                    {...register("myShopifyDomain")}
                    aria-describedby="standard_success_help"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2  appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="standard_success"
                    className="absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    MyShopifyDomain
                  </label>
                </div>
              )}
              {errors.email ? (
                <div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="standard_error"
                      aria-describedby="standard_error_help"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-red-600 appearance-none dark:text-white dark:border-red-500 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer"
                      placeholder=" "
                      {...register("email")}
                    />
                    <label
                      htmlFor="standard_error"
                      className="absolute text-sm text-red-600 dark:text-red-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                    >
                      Email
                    </label>
                  </div>
                  <p
                    id="standard_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    <span className="font-medium">Oh, snapp!</span>{" "}
                    {errors.email.message}
                  </p>
                </div>
              ) : (
                <div className="relative z-0">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    aria-describedby="standard_success_help"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
                    placeholder=" "
                    {...register("email")}
                  />
                  <label
                    htmlFor="standard_success"
                    className="absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Email
                  </label>
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => reset()}>Cancel</AlertDialogCancel>
                <Button type="submit">Submit</Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
