import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "./CreateProjectModal";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Project: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Projects</h1>
        {/* <AlertDialogTrigger> */}
        <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
        {/* </AlertDialogTrigger> */}
      </div>
      <CreateProjectModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export default Project;
