import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "./components/CreateProjectModal";
import ProjectList from "./components/ProjectList";

const Project: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4 space-y-4 h-screen ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
      </div>
      <ProjectList setOpen={setIsModalOpen} />
      <CreateProjectModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export default Project;
