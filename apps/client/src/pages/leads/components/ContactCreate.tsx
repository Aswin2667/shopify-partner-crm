import {
 	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getPhoneData, PhoneInput } from "@/components/phoneInput/components";
import { Button } from "@/components/ui/button";
import ContactService from "@/services/ContactService";
import { useParams } from "react-router-dom";
 
// Define Zod schema for contact form
const contactSchema = z.object({
	salutation: z.string().min(1, { message: 'Salutation is required' }),
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	suffix: z.string().optional(),
	title: z.string().optional(),
	email: z.string().email({ message: 'Invalid email address' }),
	phone: z.string().min(1, { message: 'Phone is required' }), // Integrated phone validation here
});

export function ContactCreate({ user } : any) {
    const {leadId,organizationId} = useParams()
	const form = useForm<z.infer<typeof contactSchema>>({
		mode: "onBlur",
		resolver: zodResolver(contactSchema),
		defaultValues: {
			salutation: "",
			firstName: "",
			lastName: "",
			suffix: "",
			title: "",
			email: "",
			phone: "",
		},
	});

	async function onSubmit(data: z.infer<typeof contactSchema>) {
        try {
          const phoneData = getPhoneData(data.phone);
      
          if (!phoneData.isValid) {
            form.setError("phone", {
              type: "manual",
              message: "Invalid phone number",
            });
            return;
          }
      
           const response = await ContactService.create({
            ...data,
            leadId: leadId as string,   
            phone: phoneData,
            organizationId,
          });
      
           toast({
            title: 'Success',
            description: 'Contact saved successfully!',
          });
      
          console.log({ ...data, phone: phoneData, response });
        } catch (error:any) {
           toast({
            title: 'Error',
            description: error?.message || 'An error occurred while saving the contact',
            variant: 'destructive',
          });
      
          console.error('Form submission error:', error);
        }
      }
      

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 rounded-md mb-6">
				<h2 className="text-lg font-semibold mb-4">Contact Information</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Label htmlFor="contact-owner">Contact Owner</Label>
						<div className="flex items-center space-x-2">
							<img
								src={user?.avatarUrl ?? ""}
								referrerPolicy="no-referrer"
								className="w-8 h-8 bg-blue-500 rounded-full"
							/>
							<span>{user?.name ?? ""}</span>
						</div>
					</div>

					<div className="md:col-span-2">
						<Label htmlFor="name" className="mb-2 block">*Name</Label>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
							<FormField
								control={form.control}
								name="salutation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Salutation</FormLabel>
										<FormControl>
											<Select {...field} onValueChange={field.onChange}>
												<SelectTrigger>
													<SelectValue placeholder="Salutation" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Mr.">Mr.</SelectItem>
													<SelectItem value="Ms.">Ms.</SelectItem>
													<SelectItem value="Mrs.">Mrs.</SelectItem>
													<SelectItem value="Dr.">Dr.</SelectItem>
													<SelectItem value="Prof.">Prof.</SelectItem>
													<SelectItem value="Mx.">Mx.</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="First Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Last Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<FormField
						control={form.control}
						name="suffix"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Suffix</FormLabel>
								<FormControl>
									<Input placeholder="Suffix" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<PhoneInput {...field} />
								</FormControl>
								<FormDescription>
									Enter a valid phone number with country code
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<Button variant="outline">Cancel</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Form>
	);
}

export default ContactCreate;
