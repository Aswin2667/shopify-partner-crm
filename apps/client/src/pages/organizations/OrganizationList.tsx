import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Home, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import React from "react";
import { UserNav } from "@/components/ui/userNav";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import OrganizationService from "@/services/OrganizationService";
import DateHelper from "@/utils/DateHelper";
import SkeletonCard from "@/components/skelotons/SkeletonCard";
import OrganizationCard from "./OrganizationCard";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  logo: z
    .any()
    .refine((files) => files.length === 1, "Logo is required")
    .optional(),
});

export function CreateOrganizationPopup({
  message,
  setReload,
  reload
}: {
  message: string;
  setReload: any;
  reload: boolean
}) {
  const [image] = React.useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  }: any = useForm({
    resolver: zodResolver(organizationSchema),
  });
  const userId = JSON.parse(sessionStorage.getItem("session") ?? "").id;
  const [loading, setLoading] = React.useState(false);
  // const handleFileChange = async (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     try {
  //       const formData = new FormData();
  //       formData.append("image", file);
  //       // setImage(formData);
  //       console.log(formData);
  //     } catch (error) {
  //       console.error("Error uploading file", error);
  //     }
  //   }
  // };
  const { mutate: onSubmit } = useMutation({
    
    mutationFn: async (data: any): Promise<any> =>
      await OrganizationService.create({ ...data, userId, image }),
    onSuccess: (response) => {
      toast({
        title: response.message,
        description: DateHelper.formatTimestamp(response.data.createdAt),
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
      setReload(!reload);
      reset();
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Login failed:", error?.response.data);
    },
  });

  const handleCancel = () => {
    reset();
  };
  const { toast } = useToast();

  return (
    <>
      <AlertDialogTrigger asChild>
        <Button>{message}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create new Organization</AlertDialogTitle>
          <AlertDialogDescription>
            Fill the following details to create an organization
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your organization name
              </label>
              <input
                type="text"
                {...register("name")}
                className={`bg-gray-50 border ${errors.name ? "border-red-500 " : "border-gray-300"} focus-visible:outline-none focus-visible:border-none text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder="Bonnie Green"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <br />
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
            {/* <div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Logo</Label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {errors.logo && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.logo.message}
                </p>
              )}
            </div> */}
          </div>
          <br />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            {loading ? (
             <Button >
             <svg
               aria-hidden="true"
               role="status"
               className="inline w-4 h-4 me-3 text-white animate-spin"
               viewBox="0 0 100 101"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
             >
               <path
                 d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                 fill="#E5E7EB"
               />
               <path
                 d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                 fill="currentColor"
               />
             </svg>
             creating
           </Button>
            ) : (
              <AlertDialogAction
                type="submit"
                onClick={(data) => onSubmit(data)}
              >
                Create
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </>
  );
}

export default function OrganizationList() {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [organizations, setOrganizations] = React.useState([]);
  const { toast } = useToast();
  const [reload, setReload] = React.useState(true);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(sessionStorage.getItem("session") ?? "").id;
      const response: any =
        await OrganizationService.getOrganizationsByUserId(userId);
      setOrganizations(response.data.data);
      if (!response.status) {
        toast({
          title: response.message,
          description: DateHelper.formatTimestamp(
            DateHelper.getCurrentUnixTime()
          ),
          duration: 1000,
          variant: `${response.status ? "default" : "destructive"}`,
        });
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const sessionData = sessionStorage.getItem("session");
    if (!sessionData) {
      navigate("/login");
    } else {
          fetchOrganizations();
    }
  },[navigate, reload])



  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">CRM</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                My Organizations
              </a>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">CRM</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  My Organizations
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(16)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can start by creating a new organization or join by
                  invitation
                </p>
                <CreateOrganizationPopup
                  message="Create new Organization"
                  setReload={setReload}
                  reload={reload}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex items-center justify-end">
                <CreateOrganizationPopup
                  message="Create"
                  setReload={setReload}
                  reload={reload}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {organizations.map((organization, index) => (
                  <OrganizationCard key={index} organization={organization} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}