
import EmailEditor from "@/pages/leads/components/EmailEditor";
import { useState } from "react";
export function DataTableToolbar() {
  const [open] = useState(false);
   return (
    <>
   
      {open && <EmailEditor />}
      
    </>
  );
}
