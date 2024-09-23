import { SidebarNav } from "@/pages/organizations/settings/components/sidebar-nav";
import React from "react";
import CliAccesTokens from "./CliAccessTokens";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelector } from "react-redux";

const sidebarNavItems: any[] = [
  {
    title: "Access Tokens",
    href: "tokens",
  },
  {
    title: "Custom Webhooks",
    href: "webhooks",
  },
];

const ProjectSettings = () => {
  const { projectId } = useParams();
  const project = useSelector((state: any) => state.project.projects).find(
    (project: any) => project.id === projectId
  );
  return (
    <div className="hidden space-y-6 md:block p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="../../..">Integration</Link>
          </BreadcrumbItem>
          <span>/</span>
          <BreadcrumbItem>
            <Link to="..">Project</Link>
          </BreadcrumbItem>
          <span>/</span>
          <BreadcrumbItem>
            <BreadcrumbPage>{project?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full ">
        <aside className=" w-[200px]">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 p-4 max-h-[800px] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
