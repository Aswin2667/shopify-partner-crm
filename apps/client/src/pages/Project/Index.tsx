import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "./components/CreateProjectModal";
import ProjectList from "./components/ProjectList";
import { useSelector } from "react-redux";
import ReduxHelper from "@/utils/ReduxHelper";

const Project: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const integrationExist = ReduxHelper.getParticularIntegrations(
    useSelector((state: any) => state.integration).integrations,
    "GMAIL",
    false
  ).length;

  console.log(integrationExist);
  return (
    <div className="p-4 space-y-4 h-screen ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Projects</h1>
        {integrationExist > 0 && (
          <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
        )}
      </div>
      <ProjectList
        setOpen={setIsModalOpen}
        integrationExist={integrationExist}
      />
      <CreateProjectModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export default Project;
