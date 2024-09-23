import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectList from "@/pages/Project/components/ProjectList";
import ProjectForm from "@/pages/Project/components/ProjectForm";

type Props = {};

const Index = (props: Props) => {
  const [activeTab, setActiveTab] = useState("projectsList");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projectsList">Projects</TabsTrigger>
          <TabsTrigger value="addProject">Add Project</TabsTrigger>
        </TabsList>
        <TabsContent value="projectsList">
          <Card>
            <ProjectList handleTabChange={handleTabChange} />
          </Card>
        </TabsContent>
        <TabsContent value="addProject">
          <ProjectForm handleTabChange={handleTabChange} />
        </TabsContent>
      </Tabs>
      {/* <h1 className="uppercase">Connected {integrationType} Accounts</h1> */}
    </div>
  );
};

export default Index;
