import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectAction } from "@/redux/projectSlice";
import DateHelper from "@/utils/DateHelper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const clickHandler = () => {
    dispatch(projectAction.setCurrentProject(project));
    navigate(`${project.id}/tokens`);
  };
  return (
    <Card onClick={clickHandler} className="hover:cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
        {/* <img
          src={organization.organization.logo}
          className="h-10 w-10 rounded-lg "
          alt=""
        /> */}
      </CardHeader>
      <CardContent>
        <div className=" text-sm font-medium">
          {project.type === "SHOPIFY" ? project.data.appId : project.type}
        </div>
        <p className="text-xs text-muted-foreground">
          {DateHelper.formatTimestamp(project.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
