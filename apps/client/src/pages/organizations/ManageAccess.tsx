import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import OrganizationService from "@/services/OrganizationService";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";
import { Plus } from "lucide-react";
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
import TeamMembers from "./settings/components/ManageAccess";


const ManageAccess = () => {
 

  return (
    <div className=" overflow-x-auto sm:rounded-lg p-2">
      <TeamMembers />
    </div>
  );
};

export default ManageAccess;
