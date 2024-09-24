import React, { useReducer } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ProjectService from "@/services/ProjectService";

import ProjectInput from "./type-input/ProjectInput";

const initialArg = {
  name: { value: "", error: "" },
  data: { value: {}, error: "" },
};

const reducerFn = (prevState: any, action: any) => {
  if (action.type === "nameVal" || action.type === "nameErr") {
    return action.type === "nameVal"
      ? {
          ...prevState,
          name: { ...prevState.name, value: action.payload },
        }
      : {
          ...prevState,
          name: { ...prevState.name, error: action.payload },
        };
  }

  if (
    action.type === "dataVal" ||
    action.type === "dataErr" ||
    action.type === "dataReset"
  ) {
    return action.type === "dataVal"
      ? {
          ...prevState,
          data: {
            ...prevState.data,
            value: { ...prevState.data.value, ...action.payload },
          },
        }
      : action.type === "dataErr"
        ? {
            ...prevState,
            data: {
              ...prevState.data,
              error: action.payload,
            },
          }
        : {
            ...prevState,
            data: { value: {}, error: "" },
          };
  }
  if (action.type === "reset") {
    return initialArg;
  }
  return prevState;
};

const ProjectForm = ({ handleTabChange }: any) => {
  const queryClient = useQueryClient();
  const { integrationType, organizationId } = useParams();
  const [project, dispatch] = useReducer(
    reducerFn,
    initialArg,
    () => initialArg
  );

  const integration = useSelector(
    (state: any) => state.integration.integrations
  ).find((integration: any) => integration.type === integrationType);

  const { mutate: createProject } = useMutation({
    mutationFn: async (data) => await ProjectService.create(data),
    onSuccess: () => {
      dispatch({ type: "reset" });
      queryClient.invalidateQueries({
        queryKey: ["getAllProjects", organizationId],
      });
      handleTabChange("projectsList");
      // ["getAllProjects", organizationId]
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const submitHandler = () => {
    if (project.name.value.trim() === "") {
      dispatch({ type: "nameErr", payload: "Project name is required" });
      return;
    }
    const projectData: any = {
      name: project.name.value,
      type: integration.type,
      data: project.data.value,
      organizationId,
      integrationId: integration.id,
    };
    console.log(projectData);
    // handleTabChange("projectsList");
    createProject(projectData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Project</CardTitle>
        <CardDescription>
          Fill in the details to create a project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form>
          {/* Project Name */}
          <div>
            <label className="block mb-2 text-sm font-medium" id="name">
              Project Name
            </label>
            <Input
              type="text"
              name="name"
              value={project.name.value}
              onChange={(e) => {
                dispatch({ type: "nameVal", payload: e.target.value });
              }}
              onFocus={() => {
                project.name.error &&
                  dispatch({ type: "nameErr", payload: "" });
              }}
              className={` border ${project.name.error ? "border-red-500 " : ""} rounded-lg block w-full p-2.5`}
              placeholder="e.g. Bonnie Green"
            />
            {project.name.error && (
              <p className="mt-2 text-sm text-red-600">{project.name.error}</p>
            )}
          </div>

          {/* Project Data Fields based on integration type */}
          <ProjectInput dispatch={dispatch} type={integration.type} />

          {/* More dynamic fields for other integration types can be added similarly */}
        </form>
      </CardContent>
      <CardFooter className="mt-6">
        <Button onClick={submitHandler}>Create</Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectForm;
