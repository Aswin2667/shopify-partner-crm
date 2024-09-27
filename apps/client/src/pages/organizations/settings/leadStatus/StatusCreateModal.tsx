import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import LeadStatusService from "@/services/LeadStatusService";

// Zod schema for form validation
const statusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const StatusCreateModal = () => {
  const {currentOrgMember} = useSelector((state: any) => state.organization)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: StatusFormValues) => {
    console.log("Form Data:", {...data,organizationId:currentOrgMember?.id});// Reset the form data
    try {
      const response = await LeadStatusService.create({
        ...data,
        organizationId:currentOrgMember?.id
      })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    reset();
    // Close the modal
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Status
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Status</AlertDialogTitle>
          <AlertDialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input placeholder="Status" {...register("status")} />
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusCreateModal;
