import SkeletonCard from "@/components/skelotons/SkeletonCard";
import { Button } from "@/components/ui/button";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { projectAction } from "@/redux/projectSlice";
import ProjectService from "@/services/ProjectService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ handleTabChange }: any): JSX.Element => {
  const dispatch = useDispatch();
  const { organizationId, integrationType } = useParams();
  const { projects } = useSelector((state: any) => state.project);

  const filteredProjects = projects.filter(
    (project: any) => project.type === integrationType
  );
  console.log(filteredProjects);

  const { isLoading } = useQueryEvents(
    useQuery({
      queryKey: ["getAllProjects", organizationId],
      queryFn: async () =>
        await ProjectService.getAllProjects(organizationId ?? ""),
      enabled: !!organizationId,
    }),
    {
      onSuccess: (response) => dispatch(projectAction.setProjects(response)),
      onError: (error) => console.error(error),
    }
  );

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col lg:gap-6 lg:p-6 h-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(16)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col lg:gap-6 lg:p-6 h-full">
      {filteredProjects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              {`You have no ${integrationType} Projects at the moment`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {`You can start by creating a new ${integrationType} Project first`}
            </p>
            <Button onClick={() => handleTabChange("addProject")}>
              Create
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProjectList;
