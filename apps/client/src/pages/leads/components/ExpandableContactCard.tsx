import { useEffect, useState } from "react";
import { z } from "zod";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { leadAction } from "@/redux/leadSlice";
import { getPhoneData, PhoneInput } from "@/components/phoneInput/components";
import ContactCreate from "./ContactCreate";

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
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { leadId, organizationId } = useParams();
  const [phone, setPhone] = useState("");
  const user = JSON.parse(localStorage.getItem("session") ?? "");
  const { leadContacts: contacts } = useSelector((state: any) => state.lead);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "" },
  });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  useQueryEvents(
    useQuery({
      queryKey: ["getAllContactsForLead", leadId],
      queryFn: async () => await ContactService.getByLeadId(leadId as string),
      enabled: !!leadId,
    }),
    {
      onSuccess: (response: any) =>
        dispatch(leadAction.setLeadContacts(response.data)),
      onError: (error: any) => console.log(error),
    }
  );

  const { mutate: createContact } = useMutation({
    mutationFn: async (data: any) =>
      await ContactService.create({
        ...data,
        leadId,
        integrationId,
        organizationId,
      }),
    onSuccess: (response) => {
      console.log(response);
      reset(); // Clear form data
      queryClient.invalidateQueries({
        queryKey: ["getAllContactsForLead", leadId],
      });
      toast.success("Contact added successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to add contact");
      console.error("Creation failed:", error?.response.data);
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createContact(data);
    } catch (error: any) {
      console.error("Creation failed:", error?.response.data);
    }
  };
  const phoneData = getPhoneData(phone);
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
                    <AlertDialogContent className="min-w-fit ">
                      {/* <AlertDialogHeader>
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
                               <PhoneInput
                                value={phone}
                                onChange={handleOnChange}
                              />
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
                      </AlertDialogHeader> */}
                      {/* <div className=" p-4 rounded-md mb-6 min">
                        <h2 className="text-lg font-semibold mb-4">
                          Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="contact-owner">Contact Owner</Label>
                            <div className="flex items-center space-x-2">
                              <img
                                src={user?.avatarUrl ?? ""}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                              />
                              <span>{user?.name ?? ""}</span>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor="name" className="mb-2 block">
                              *Name
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                              <Select>
                                <SelectTrigger id="salutation">
                                  <SelectValue placeholder="Salutation" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">--None--</SelectItem>
                                  <SelectItem value="mr">Mr.</SelectItem>
                                  <SelectItem value="ms">Ms.</SelectItem>
                                  <SelectItem value="mrs">Mrs.</SelectItem>
                                  <SelectItem value="dr">Dr.</SelectItem>
                                  <SelectItem value="prof">Prof.</SelectItem>
                                  <SelectItem value="mx">Mx.</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="First Name"
                                className="lg:col-span-2"
                              />
                              <Input
                                placeholder="Last Name"
                                className="lg:col-span-2"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="suffix">Suffix</Label>
                            <Input id="suffix" placeholder="Suffix" />
                          </div>

                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="Title" />
                          </div>

                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <PhoneInput
                              value={phone}
                              onChange={handleOnChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save</Button>
                      </div> */}
                      <ContactCreate user={user} />
                    </AlertDialogContent>
                  </AlertDialog>
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((contact: any) => (
                <tr
                  key={contact.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-4"
                  >
                    {`${contact.name} <${contact.email}>`}
                  </th>
                  <td className="px-6 py-4 text-end"></td>
                  <td className="px-6 py-4 flex justify-end gap-5 relative">
                    <TooltipProvider>
                      {/* Call Button */}
                      <Tooltip>
                        <TooltipTrigger>
                          <button className="flex items-center hover:text-gray-600 justify-end cursor-pointer ">
                            <Phone className="w-4 h-4 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Call</TooltipContent>
                      </Tooltip>

                      {/* Send Email Button */}
                      <Tooltip>
                        <TooltipTrigger onClick={() => router("emails")}>
                          <button className="flex items-center hover:text-gray-600 justify-end cursor-pointer">
                            <Mail className="w-4 h-4 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Send Email</TooltipContent>
                      </Tooltip>

                      {/* More Options Dropdown */}
                      <DropdownMenu>
                        <Tooltip>
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
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
