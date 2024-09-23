import { useEffect, useReducer } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProjectService from "@/services/ProjectService";
import ReduxHelper from "@/utils/ReduxHelper";
import ShopifyInput from "./type-input/ShopifyInput";
import ProjectInput from "./type-input/ProjectInput";
import { Input } from "@/components/ui/input";

const initialArg = {
  name: { value: "", error: "" },
  integration: { value: {}, error: "" },
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
    action.type === "integrationVal" ||
    action.type === "integrationErr" ||
    action.type === "integrationReset"
  ) {
    return action.type === "integrationVal"
      ? {
          ...prevState,
          integration: {
            ...prevState.integration,
            value: action.payload,
          },
        }
      : action.type === "integrationErr"
        ? {
            ...prevState,
            integration: {
              ...prevState.integration,
              error: action.payload,
            },
          }
        : {
            ...prevState,
            integration: { value: {}, error: "" },
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

const CreateProjectModal = ({ open, setOpen }: any) => {
  const { organizationId } = useParams();

  const [project, dispatch] = useReducer(
    reducerFn,
    initialArg,
    () => initialArg
  );

  const { integrations } = useSelector((state: any) => state.integration);

  const singularIntegrations = integrations.filter(
    (integration: any) => integration.isSingular
  );

  const { mutate: createProject } = useMutation({
    mutationFn: async (data) => await ProjectService.create(data),
    onSuccess: () => {
      dispatch({ type: "reset" });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const closeHandler = () => {
    dispatch({ type: "reset" });
    setOpen(false);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (project.name.value.trim() === "") {
      dispatch({ type: "nameErr", payload: "Project name is required" });
      return;
    }
    const projectData: any = {
      name: project.name.value,
      type: project.integration.value.type,
      data: project.data.value,
      organizationId,
      integrationId: project.integration.value.id,
    };
    createProject(projectData);
  };

  console.log(project);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Project</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details to create a project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submitHandler}>
          {/* Project Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Project Name
            </label>
            <Input
              type="text"
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

          {/* Integration Type */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium">
              Integration Type
            </label>
            <Select
              onValueChange={(value: any) => {
                const integration = integrations.find(
                  (integration: any) => integration.id === value
                );
                dispatch({
                  type: "integrationVal",
                  payload: integration,
                });
                dispatch({ type: "dataReset" });
              }}
            >
              <SelectTrigger
                className={`w-full ${project.integration.error ? "bowrder-red-500" : ""}`}
              >
                <SelectValue placeholder="Select an Integration Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Integration Type</SelectLabel>
                  {singularIntegrations.map((integration: any) => (
                    <SelectItem key={integration.id} value={integration.id}>
                      {integration.type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {project.integration.error && (
              <p className="mt-2 text-sm text-red-600">
                {project.integration.error.message}
              </p>
            )}
          </div>

          {/* Project Data Fields based on integration type */}
          <ProjectInput
            dispatch={dispatch}
            type={project.integration.value.type}
          />

          {/* More dynamic fields for other integration types can be added similarly */}

          <AlertDialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={closeHandler}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateProjectModal;
