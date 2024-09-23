import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Ellipsis,
  Expand,
  Mail,
  Phone,
  Plus,
  Trash,
  Workflow,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ContactService from "@/services/ContactService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 import { useNavigate, useParams } from "react-router-dom";

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof contactSchema>;

const ExpandableContactCard = ({
  integrationId,
}: {
  integrationId: string;
}) => {
  const [contacts, setContacts] = useState([]);
  const { leadId, organizationId } = useParams();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "" },
  });

  const fetchContacts = async () => {
    try {
      const response = await ContactService.getByLeadId(leadId as string);
      setContacts(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await ContactService.create({
        ...data,
        leadId,
        integrationId,
        organizationId,
      });
      fetchContacts();
      reset(); // Clear form data
      toast.success("Contact added successfully");
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };
  const router = useNavigate();
  return (
    <TooltipProvider>
      <DropdownMenu>
        <div className="relative overflow-x-auto">
          <table className="w-full max-h-[500px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 rounded-sm uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Contacts
                </th>
                <th scope="col" className="px-6 py-3"></th>
                <th
                  scope="col"
                  className="px-6 py-3 justify-end flex items-center"
                >
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Plus className="w-4 h-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Add a contact to this lead
                        </AlertDialogTitle>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Contact Name
                            </label>
                            <Controller
                              name="name"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  id="name"
                                  type="text"
                                  className={`bg-gray-50 border ${
                                    errors.name
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                  placeholder="Alex"
                                />
                              )}
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm">
                                {errors.name.message}
                              </p>
                            )}
                            <br />
                            <div className="w-full">
                              <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Email
                              </label>
                              <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    id="email"
                                    type="email"
                                    className={`bg-gray-50 border ${
                                      errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="contact email"
                                  />
                                )}
                              />
                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <br />
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => reset()}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction type="submit">
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
                      </AlertDialogHeader>
                    </AlertDialogContent>
                  </AlertDialog>
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: any) => (
                <tr
                  key={contact.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-4"
                  >
                    {contact.name}
                    {contact.primaryEmail}
                  </th>
                  <td className="px-6 py-4 text-end"></td>
                  <td className="px-6 py-4 flex justify-end gap-5 relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button className="flex items-center hover:text-gray-600 justify-end cursor-pointer ">
                            <Phone className="w-4 h-4 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Call</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger onClick={() => router("emails")}>
                          <button className="flex items-center hover:text-gray-600 justify-end cursor-pointer">
                            <Mail className="w-4 h-4 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Send Email</TooltipContent>
                      </Tooltip>
                      {/* <Tooltip>
                        <TooltipTrigger>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center hover:text-gray-600 justify-end">
                              <Ellipsis className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>More Options</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Workflow className="w-4 h-4" />
                          Enroll in Workflow
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Expand className="w-4 h-4" />
                          Detailed View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Trash className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent> */}
                    </TooltipProvider>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default ExpandableContactCard;
