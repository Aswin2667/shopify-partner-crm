import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import EmailEditor from "@/pages/leads/components/EmailEditor";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DataTableToolbar() {
  const [open, setOpen] = useState(false);
    const navigate = useNavigate();
  return (
    <>
   
      {open && <EmailEditor />}
      
    </>
  );
}
