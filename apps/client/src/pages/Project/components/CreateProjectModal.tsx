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

const initialArg = {
  name: { value: "", error: "" },
  integrationType: { value: "", error: "" },
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
    action.type === "integrationTypeVal" ||
    action.type === "integrationTypeErr"
  ) {
    return action.type === "integrationTypeVal"
      ? {
          ...prevState,
          integrationType: {
            ...prevState.integrationType,
            value: action.payload,
          },
        }
      : {
          ...prevState,
          integrationType: {
            ...prevState.integrationType,
            error: action.payload,
          },
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

  const integration = ReduxHelper.getParticularIntegrations(
    useSelector((state: any) => state.integration).integrations,
    "GMAIL",
    false
  );
  const integrationTypes = [
    ...new Set(integration.map((integration: any) => integration.type)),
  ];

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
      type: project.integrationType.value,
      data: project.data.value,
      organizationId,
      integrationId: project.integration.value,
    };
    createProject(projectData);
  };

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
            <input
              type="text"
              value={project.name.value}
              onChange={(e) => {
                dispatch({ type: "nameVal", payload: e.target.value });
              }}
              onFocus={() => {
                project.name.error &&
                  dispatch({ type: "nameErr", payload: "" });
              }}
              className={`bg-gray-50 border ${project.name.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
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
              onValueChange={(value) => {
                dispatch({ type: "integrationTypeVal", payload: value });
                dispatch({ type: "dataReset" });
                dispatch({ type: "integrationReset" });
              }}
            >
              <SelectTrigger
                className={`w-full ${project.integrationType.error ? "bowrder-red-500" : ""}`}
              >
                <SelectValue placeholder="Select an Integration Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Integration Type</SelectLabel>
                  {integrationTypes.map((type: any, index: number) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {project.integrationType.error && (
              <p className="mt-2 text-sm text-red-600">
                {project.integrationType.error.message}
              </p>
            )}
          </div>

          {/* Integration Name */}
          {project.integrationType.value && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium">
                Integration Name
              </label>
              <Select
                onValueChange={(value) => {
                  dispatch({ type: "integrationVal", payload: value });
                }}
              >
                <SelectTrigger
                  className={`w-full ${project.integration.error ? "bowrder-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select an Integration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Integration Name</SelectLabel> */}
                    {integration
                      .filter(
                        (integration: any) =>
                          integration.type === project.integrationType.value
                      )
                      .map((integration: any) => (
                        <SelectItem key={integration.id} value={integration.id}>
                          {integration.name}
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
          )}

          {/* Dynamic Fields */}
          {project.integrationType.value === "SHOPIFY" && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium">App ID</label>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                placeholder="e.g. 123456"
                onChange={(e) =>
                  dispatch({
                    type: "dataVal",
                    payload: { appId: e.target.value },
                  })
                }
              />
            </div>
          )}

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
