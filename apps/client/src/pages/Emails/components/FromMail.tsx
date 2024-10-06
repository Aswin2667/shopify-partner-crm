import { useReducer } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MailService from "@/services/MailService";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
 
 
const initialArg = {
  name: { value: "", error: "" },
  email: { value: "", error: "" },
  type: { value: "", error: "" },
  replyTo: { value: "", error: "" },
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
  if (action.type === "emailVal" || action.type === "emailErr") {
    return action.type === "emailVal"
      ? {
          ...prevState,
          email: { ...prevState.email, value: action.payload },
        }
      : {
          ...prevState,
          email: { ...prevState.email, error: action.payload },
        };
  }
  if (
    action.type === "typeVal" ||
    action.type === "typeErr" ||
    action.type === "typeReset"
  ) {
    return action.type === "typeVal"
      ? {
          ...prevState,
          type: { ...prevState.type, value: action.payload },
        }
      : action.type === "typeErr"
        ? {
            ...prevState,
            type: { ...prevState.type, error: action.payload },
          }
        : {
            ...prevState,
            type: { value: "", error: "" },
          };
  }

  if (action.type === "replyToVal" || action.type === "replyToErr") {
    return action.type === "replyToVal"
      ? {
          ...prevState,
          replyTo: { ...prevState.replyTo, value: action.payload },
        }
      : {
          ...prevState,
          replyTo: { ...prevState.replyTo, error: action.payload },
        };
  }
  if (action.type === "reset") {
    return initialArg;
  }
  return prevState;
};

const FromMail = () => {
  const { toast } = useToast();
  const { organizationId } = useParams();

  const [from, dispatch] = useReducer(reducerFn, initialArg, () => initialArg);

  const { sendAs } = useSelector((state: any) => state.mail);
  const { integrations, presentIntegrations } = useSelector(
    (state: any) => state.integration
  );

  const mailServiceIntegrations = integrations.filter(
    (integration: any) => integration.category === "MAIL_SERVICE"
  );

  console.log(sendAs);
  console.log(mailServiceIntegrations);

  const { mutate: createFromEmail } = useMutation({
    mutationFn: async (data: any) => await MailService.createFromEmail(data),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
      dispatch({ type: "reset" });
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  const { mutate: deleteFromEmail } = useMutation({
    mutationFn: async (id) => await MailService.deleteFromEmail(id),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
    },
    onError: (error: any) => {
      console.error("Deletion failed:", error?.response.data);
    },
  });

  function submitHandler(e: any) {
    e.preventDefault();
    const integration = mailServiceIntegrations.find(
      (integration: any) => integration.type === from.type.value
    );

    const data = {
      fromName: from.name.value ?? "",
      fromEmail: from.email.value ?? "",
      type: from.type.value,
      replyTo: from.replyTo.value ?? "",
      integrationId: integration?.id || null,
      organizationId,
    };
    console.log(data);
    createFromEmail(data);
  }

  return (
    <div>
      <br />

      <h2 className="text-lg font-semibold mb-2">From Mail</h2>
      <Card>
        <div className="overflow-x-auto">
          {sendAs.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-center border-b">
                <tr>
                  <th scope="col" className="p-4">
                    Name
                  </th>
                  <th scope="col" className="p-4">
                    Email
                  </th>
                  <th scope="col" className="p-4">
                    Source
                  </th>
                  <th scope="col" className="p-4 ">
                    Reply To
                  </th>
                  <th scope="col" className="p-4 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sendAs.map((integration: any) => {
                  return (
                    <tr className="dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ">
                      {/* Name */}
                      <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        {integration.fromName}
                      </td>
                      {/* Email */}
                      <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        {integration.fromEmail}
                      </td>
                      {/* Source */}
                      <td className="p-4 text-center">
                        <img
                          src={
                            presentIntegrations.find(
                              (i: any) => i.type === integration?.type
                            ).logo
                          }
                          alt="asd"
                          className="w-5 h-5 mx-auto"
                        />
                      </td>
                      {/* Reply To */}
                      <td className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        {integration.replyTo ? integration.replyTo : "-"}
                      </td>
                      {/* CreatedAt */}
                      {/* <td className="p-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                        {DateHelper.formatTimestamp(integration.createdAt)}
                      </td> */}
                      {/* Actions */}
                      <td className="p-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 border"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link to={`edit/${integration?.id}`}>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() => deleteFromEmail(integration?.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center p-20">
              {`YOU HAVE NO FROM MAIL ACCOUNT(S) CONNECTED YET`}
            </div>
          )}
        </div>
      </Card>
      <br />

      <Card>
        <CardHeader>
          <CardTitle>From Email</CardTitle>
          <CardDescription>
            Change your password here. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={submitHandler} className="space-y-4">
            {/*  Type */}
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="type">
                Type
              </label>
              <Select
                onValueChange={(value) =>
                  dispatch({ type: "typeVal", payload: value })
                }
              >
                <SelectTrigger
                  className="w-full"
                  id="type"
                  value={from.type.value}
                >
                  <SelectValue placeholder="Select a Mail Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Mail Services</SelectLabel>
                    {mailServiceIntegrations.map((integration: any) => (
                      <SelectItem key={integration.id} value={integration.type}>
                        {integration.type.split("_").join(" ")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/*  Name */}
            {from.type.value && from.type.value !== "GMAIL" && (
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={from.name.value}
                  onChange={(e) => {
                    dispatch({ type: "nameVal", payload: e.target.value });
                  }}
                  onFocus={() => {
                    from.name.error &&
                      dispatch({ type: "nameErr", payload: "" });
                  }}
                  className={`bg-gray-50 border ${from.name.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
                  placeholder="e.g. Bonnie Green"
                />
                {from.name.error && (
                  <p className="mt-2 text-sm text-red-600">{from.name.error}</p>
                )}
              </div>
            )}

            {/*  Email */}
            {from.type.value && from.type.value !== "GMAIL" && (
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={from.email.value}
                  onChange={(e) => {
                    dispatch({ type: "emailVal", payload: e.target.value });
                  }}
                  onFocus={() => {
                    from.email.error &&
                      dispatch({ type: "emailErr", payload: "" });
                  }}
                  className={`bg-gray-50 border ${from.email.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
                  placeholder="e.g. bonniegreen@gmail.com"
                />
                {from.email.error && (
                  <p className="mt-2 text-sm text-red-600">
                    {from.email.error}
                  </p>
                )}
              </div>
            )}

            {/*  Reply To */}
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                htmlFor="replyTo"
              >
                Reply To
              </label>
              <input
                id="replyTo"
                type="text"
                value={from.replyTo.value}
                onChange={(e) => {
                  dispatch({ type: "replyToVal", payload: e.target.value });
                }}
                onFocus={() => {
                  from.replyTo.error &&
                    dispatch({ type: "replyToErr", payload: "" });
                }}
                className={`bg-gray-50 border ${from.replyTo.error ? "border-red-500 " : "border-gray-300"} rounded-lg block w-full p-2.5`}
                placeholder="e.g. bonniegreen@gmail.com"
              />
              {from.replyTo.error && (
                <p className="mt-2 text-sm text-red-600">
                  {from.replyTo.error}
                </p>
              )}
            </div>

            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FromMail;
