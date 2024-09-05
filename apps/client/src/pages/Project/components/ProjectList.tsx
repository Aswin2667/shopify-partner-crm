import SkeletonCard from "@/components/skelotons/SkeletonCard";
import { Button } from "@/components/ui/button";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { projectAction } from "@/redux/projectSlice";
import ProjectService from "@/services/ProjectService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ setOpen, integrationExist }: any): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const { projects } = useSelector((state: any) => state.project);

  const { isLoading } = useQueryEvents(
    useQuery({
      queryKey: ["getAllProjects"],
      queryFn: async () =>
        await ProjectService.getAllProjects(organizationId || ""),
    }),
    {
      onSuccess: (response) => dispatch(projectAction.setProjects(response)),
      onError: (error) => console.error(error),
    }
  );

  return (
    <main className="flex flex-1 flex-col lg:gap-6 lg:p-6 h-full">
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(16)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              {`You have no ${integrationExist > 0 ? "Projects" : "Integrations"} at the moment`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {`You can start by creating a new ${integrationExist > 0 ? "Project" : "Integration"} first`}
            </p>
            <Button
              onClick={() =>
                integrationExist > 0
                  ? setOpen(true)
                  : navigate(`/${organizationId}/settings/integration`)
              }
            >
              Create
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default ProjectList;
