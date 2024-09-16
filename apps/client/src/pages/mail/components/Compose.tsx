import { useSelector } from "react-redux";
import Editor from "./Editor";
import { act, useEffect, useReducer, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import ReactSelect from "@/components/ReactSelect";
import { Trash2 } from "lucide-react";
import MailBadge from "./MailBadge";
import { useMutation } from "@tanstack/react-query";
import MailService from "@/services/MailService";
import { useParams } from "react-router-dom";
import IntegrationService from "@/services/IntegrationService";
import axios from "axios";
import TemplateService from "@/services/TemplatesService";
import { defaultTemplates } from "@/pages/organizations/settings/templates/Templates";
import template from "lodash.template";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateHelper from "../../../utils/DateHelper";
import { DatePicker } from "rsuite";
import "rsuite/DatePicker/styles/index.css";
import { FaCalendar } from "react-icons/fa";

type Props = {};

const initialArgs = {
  from: null,
  to: [],
  cc: { isEnabled: false, value: [] },
  bcc: { isEnabled: false, value: [] },
  subject: "",
  body: "",
  template: { selected: {}, all: defaultTemplates || [] },
  scheduledAt: null,
};

const reducerFn = (prevState: any, action: any) => {
  if (action.type === "from") {
    return { ...prevState, from: action.payload };
  }
  if (action.type === "toAdd" || action.type === "toRemove") {
    return action.type === "toAdd"
      ? { ...prevState, to: [...prevState.to, action.payload] }
      : {
          ...prevState,
          to: action.payload,
        };
  }
  if (
    action.type === "ccEnabled" ||
    action.type === "ccValueAdd" ||
    action.type === "ccValueRemove"
  ) {
    return action.type === "ccEnabled"
      ? { ...prevState, cc: { ...prevState.cc, isEnabled: action.payload } }
      : action.type === "ccValueAdd"
        ? {
            ...prevState,
            cc: {
              ...prevState.cc,
              value: [...prevState.cc.value, action.payload],
            },
          }
        : {
            ...prevState,
            cc: {
              ...prevState.cc,
              value: action.payload,
            },
          };
  }

  if (
    action.type === "bccEnabled" ||
    action.type === "bccValueAdd" ||
    action.type === "bccValueRemove"
  ) {
    return action.type === "bccEnabled"
      ? { ...prevState, bcc: { ...prevState.bcc, isEnabled: action.payload } }
      : action.type === "bccValueAdd"
        ? {
            ...prevState,
            bcc: {
              ...prevState.bcc,
              value: [...prevState.bcc.value, action.payload],
            },
          }
        : {
            ...prevState,
            bcc: {
              ...prevState.bcc,
              value: action.payload,
            },
          };
  }
  if (action.type === "subject") {
    return { ...prevState, subject: action.payload };
  }
  if (action.type === "body") {
    return { ...prevState, body: action.payload };
  }
  if (action.type === "allTemplate" || action.type === "selectedTemplate") {
    return action.type === "allTemplate"
      ? {
          ...prevState,
          template: {
            ...prevState.template,
            all: [...prevState.template.all, ...action.payload],
          },
        }
      : {
          ...prevState,
          template: {
            ...prevState.template,
            selected: action.payload,
          },
        };
  }
  if (action.type === "scheduledAt") {
    return { ...prevState, scheduledAt: action.payload };
  }
  if (action.type === "clear") {
    return initialArgs;
  }
  return prevState;
};

const Compose = (props: Props): JSX.Element => {
  const { organizationId } = useParams();
  const [compose, dispatch] = useReducer(
    reducerFn,
    initialArgs,
    () => initialArgs
  );
  const { integrations, presentIntegrations } = useSelector(
    (state: any) => state.integration
  );
  const fromEmail = integrations.flatMap(
    (integration: any) => integration.mailServiceFromEmail
  );
  console.log(compose);

  const { mutate: sendMail } = useMutation({
    mutationFn: async (data: any) =>
      IntegrationService.performAction(
        compose.from.type,
        "SCHEDULE_MAIL",
        data
      ),
  onSuccess: (res) => dispatch({type: "clear"}),
    onError: (error) => console.error(error),
  });

  const sendHandler = () => {
    const mailContext = {
      from: { name: compose.from.name, email: compose.from.email },
      to: compose.to,
      cc: compose.cc.value,
      bcc: compose.bcc.value,
      subject: compose.subject,
      body: compose.body,
      integrationId: compose.from.integrationId,
      organizationId,
      source: compose.from.type,
      scheduledAt: compose.scheduledAt
        ? compose.scheduledAt
        : DateHelper.getCurrentUnixTime(),
    };

    console.log(mailContext);
    sendMail(mailContext);
  };

  const setBody = (value: any) => {
    dispatch({ type: "body", payload: value });
  };

  function handleKeyDown(e: any, type: string) {
    // Check if the event type is 'blur' or the key is 'Enter'
    if (e.type === "blur" || e.key === "Enter") {
      const value = e.target.value;
      // Proceed only if value is not empty
      if (!value.trim()) return;

      // Dispatch the action based on the type
      if (type === "toAdd" || type === "ccValueAdd" || type === "bccValueAdd") {
        dispatch({ type, payload: value });
        e.target.value = ""; // Clear the input field
      }
    }
  }

  function removeTag(index: any, type: string) {
    if (type === "toRemove") {
      dispatch({
        type,
        payload: compose.to.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "ccValueRemove") {
      dispatch({
        type,
        payload: compose.cc.value.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "bccValueRemove") {
      dispatch({
        type,
        payload: compose.bcc.value.filter((el: any, i: number) => i !== index),
      });
    }
  }

  // useEffect(() => {
  //   dispatch({ type: "from", payload: gmailIntegrations[0] });
  // }, [gmailIntegrations]);

  useEffect(() => {
    TemplateService.getAllTemplatesByOrgId(organizationId as string)
      .then((res) => dispatch({ type: "allTemplate", payload: res.data?.data }))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="border  mb-5 rounded-md text-sm">
      <div className="bg-white p-3 rounded-t-md  font-medium">
        {compose.subject.trim() === "" ? "(no subject)" : compose.subject}
      </div>
      {/* From */}
      <div className="px-3 py-2 border-y flex items-center gap-4">
        <h6 className="text-gray-500">From</h6>

        <Select
          onValueChange={(value) => dispatch({ type: "from", payload: value })}
          // defaultValue={compose.from.data?.email}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select an email" />
          </SelectTrigger>
          <SelectContent>
            {fromEmail.map((integration: any) => (
              <SelectItem value={integration}>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      presentIntegrations.find(
                        (i: any) => i.type === integration.type
                      )?.logo
                    }
                    alt=""
                    className="h-4 w-4 rounded-ful"
                  />
                  <h6 className="capitalize">{integration?.name}</h6>
                  <h6 className="text-gray-500 ">
                    {`<${integration?.email}>`}
                  </h6>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* To */}
      <div className="px-3 py-2 border-b flex items-center gap-4">
        <h6 className="text-gray-500">To</h6>
        <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
          {compose.to.map((tag: any, index: number) => (
            <MailBadge
              key={index}
              text={tag}
              onClick={() => removeTag(index, "toRemove")}
            />
          ))}
          <input
            onBlur={(e) => handleKeyDown(e, "toAdd")}
            onKeyDown={(e) => handleKeyDown(e, "toAdd")}
            type="text"
            className="flex-grow  outline-none"
            placeholder="Recepient's Email"
          />
        </div>
        <div className="flex gap-2 text-blue-500 font-medium">
          {!compose.cc.isEnabled && (
            <h6
              className="cursor-pointer"
              onClick={() => dispatch({ type: "ccEnabled", payload: true })}
            >
              CC
            </h6>
          )}
          {!compose.bcc.isEnabled && (
            <h6
              className="cursor-pointer"
              onClick={() => dispatch({ type: "bccEnabled", payload: true })}
            >
              BCC
            </h6>
          )}
        </div>
      </div>

      {/* CC */}
      {compose.cc.isEnabled && (
        <div className="px-3 py-2 border-b flex items-center gap-4">
          <h6 className="text-gray-500">CC</h6>
          <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
            {compose.cc.value.map((tag: any, index: number) => (
              <MailBadge
                key={index}
                text={tag}
                color="yellow"
                onClick={() => removeTag(index, "ccValueRemove")}
              />
            ))}
            <input
              onBlur={(event) => handleKeyDown(event, "ccValueAdd")}
              onKeyDown={() => handleKeyDown(event, "ccValueAdd")}
              type="text"
              className="flex-grow  outline-none"
              placeholder="Recepient's Email"
            />
          </div>
        </div>
      )}
      {/* BCC */}
      {compose.bcc.isEnabled && (
        <div className="px-3 py-2 border-b flex items-center gap-4">
          <h6 className="text-gray-500">BCC</h6>
          <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
            {compose.bcc.value.map((tag: any, index: number) => (
              <MailBadge
                key={index}
                text={tag}
                color="green"
                onClick={() => removeTag(index, "bccValueRemove")}
              />
            ))}
            <input
              onBlur={(event) => handleKeyDown(event, "bccValueAdd")}
              onKeyDown={() => handleKeyDown(event, "bccValueAdd")}
              type="text"
              className="flex-grow  outline-none"
              placeholder="Recepient's Email"
            />
          </div>
        </div>
      )}
      {/* SUbject and Template */}
      <div className="flex">
        <div className="w-[60%] ">
          <input
            placeholder="Subject"
            className="px-3 py-2 w-full"
            value={compose.subject}
            // onChange={(e) => setSubject(e.target.value)}
            onChange={(e) =>
              dispatch({ type: "subject", payload: e.target.value })
            }
          />
        </div>
        <div className="w-[40%] border-l">
          <ReactSelect
            placeholder="Choose a Template"
            options={[...new Set(compose.template.all)]}
            onChange={(template: any) => {
              dispatch({ type: "selectedTemplate", payload: template });
              dispatch({ type: "body", payload: template.html });
            }}
          />
        </div>
      </div>
      <Editor value={compose.body} setValue={setBody} />
      <div className="flex justify-between p-4">
        <div className="flex gap-3">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={sendHandler}
            disabled={!compose.from?.type}
          >
            Send
          </button>
          <DatePicker
            format="dd MMM yyyy hh:mm:ss aa"
            placeholder="Schedule"
            showMeridian
            caretAs={FaCalendar}
            disabled={!compose.from?.type}
            onChange={(e) =>
              dispatch({
                type: "scheduledAt",
                payload: DateHelper.convertToUnixTimestamp(e && (e as any)),
              })
            }
          />
        </div>
        <div className="flex gap-3 text-gray-500">
          <button className="border  px-3 py-1 rounded-full font-semibold">
            Save Draft
          </button>
          <button>
            <Trash2 className="w-5 h-5 hover:text-gray-600 transition-all ease-linear" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compose;
