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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import IntegrationService from "@/services/IntegrationService";
import ReduxHelper from "@/utils/ReduxHelper";
import ShopifyInput from "./type-inputs/ShopifyInput";
import { IntegrationType } from "@org/integrations";
import IntegrationInput, {
  IntegrationInputType,
} from "./type-inputs/IntegrationInput";
import { INTEGRATION_TYPES } from "./type-inputs/type";

const initialArg = {
  name: { value: "", error: "" },
  description: { value: "", error: "" },
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
  if (action.type === "descriptionVal" || action.type === "descriptionErr") {
    return action.type === "descriptionVal"
      ? {
          ...prevState,
          description: { ...prevState.description, value: action.payload },
        }
      : {
          ...prevState,
          description: { ...prevState.description, error: action.payload },
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

const CreateIntegrationModal = ({ open, setOpen }: any) => {
  const navigate = useNavigate();
  const { organizationId, integrationType } = useParams();

  const [integration, dispatch] = useReducer(
    reducerFn,
    initialArg,
    () => initialArg
  );

  const { mutate: connectIntegration } = useMutation({
    mutationFn: async (data) => await IntegrationService.connect(data),
    onSuccess: () => {
      dispatch({ type: "reset" });
      setOpen(false);
      navigate(`/${organizationId}/settings/integration`);
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
    // if (integration.name.value.trim() === "") {
    //   dispatch({ type: "nameErr", payload: "integration name is required" });
    //   return;
    // }
    const IntegrationData: any = {
      name: integration.name.value,
      description: integration.description.value,
      type: INTEGRATION_TYPES[
        integrationType?.toUpperCase() as keyof typeof INTEGRATION_TYPES
      ],
      data: integration.data.value,
      organizationId,
    };
    console.log(IntegrationData);
    connectIntegration(IntegrationData);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create an Integration</AlertDialogTitle>
          <AlertDialogDescription>
            {`Fill in the details to create an ${integrationType} Integration.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Integration Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              value={integration.name.value}
              onChange={(e) => {
                dispatch({ type: "nameVal", payload: e.target.value });
              }}
              onFocus={() => {
                integration.name.error &&
                  dispatch({ type: "nameErr", payload: "" });
              }}
              className={`bg-gray-50 border ${integration.name.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
              placeholder="e.g. Bonnie Green"
            />
            {integration.name.error && (
              <p className="mt-2 text-sm text-red-600">
                {integration.name.error}
              </p>
            )}
          </div>

          {/* Integration Description */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              value={integration.description.value}
              onChange={(e) => {
                dispatch({ type: "descriptionVal", payload: e.target.value });
              }}
              onFocus={() => {
                integration.description.error &&
                  dispatch({ type: "descriptionErr", payload: "" });
              }}
              className={`bg-gray-50 border ${integration.description.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
              placeholder="e.g. Bonnie Green"
            />
            {integration.description.error && (
              <p className="mt-2 text-sm text-red-600">
                {integration.description.error}
              </p>
            )}
          </div>

          {/* Dynamic Input Fields based on Integration Type*/}
          <IntegrationInput
            type={integrationType?.toUpperCase() as IntegrationInputType}
            dispatch={dispatch}
          />

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

export default CreateIntegrationModal;
