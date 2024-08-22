import { useSelector } from "react-redux";
import Editor from "./Editor";
import { act, useReducer, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import ReactSelect from "@/components/ReactSelect";
import { Trash2 } from "lucide-react";
import MailBadge from "./MailBadge";
import { useMutation } from "@tanstack/react-query";
import MailService from "@/services/MailService";
import { useParams } from "react-router-dom";

type Props = {};

const initialArgs = {
  from: "",
  to: [],
  cc: { isEnabled: false, value: [] },
  bcc: { isEnabled: false, value: [] },
  subject: "",
  body: "",
};

const reducerFn = (prevState: any, action: any) => {
  if (action.type === "from") {
    return { ...prevState, from: action.payload };
  }
  if (action.type === "toAdd" || action.type === "toRemove") {
    console.log(action.payload);
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
    console.log(action.payload);
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
    console.log(action.payload);
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
  if (action.type === "clear") {
    return initialArgs;
  }
  return prevState;
};

const Compose = (props: Props): JSX.Element => {
  const [mail, dispatch] = useReducer(
    reducerFn,
    initialArgs,
    () => initialArgs
  );
  const { gmail } = useSelector((state: any) => state.integration);
  console.log();

  const { mutate: sendMail } = useMutation({
    mutationFn: async (data: any) => MailService.sendMail(data),
    onSuccess: (res) => console.log(res),
    onError: (error) => console.error(error),
  });

  const sendHandler = () => {
    const mailContext = {
      to: mail.to,
      cc: mail.cc.value,
      bcc: mail.bcc.value,
      subject: mail.subject,
      body: mail.body,
      refreshToken: gmail.data.refreshToken,
      accessToken: gmail.data.accessToken,
      gmailIntegrationId: gmail.id,
    };

    console.log(mailContext);
    sendMail(mailContext);
  };

  const setBody = (value: any) => {
    dispatch({ type: "body", payload: value });
  };

  function handleKeyDown(e: any, type: string) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;

    if (type === "toAdd") {
      dispatch({ type, payload: value });
      e.target.value = "";
      return;
    }
    if (type === "ccValueAdd") {
      dispatch({ type, payload: value });
      e.target.value = "";
      return;
    }
    if (type === "bccValueAdd") {
      dispatch({ type, payload: value });
      e.target.value = "";
      return;
    }
  }

  function removeTag(index: any, type: string) {
    if (type === "toRemove") {
      dispatch({
        type,
        payload: mail.to.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "ccValueRemove") {
      dispatch({
        type,
        payload: mail.cc.value.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "bccValueRemove") {
      dispatch({
        type,
        payload: mail.bcc.value.filter((el: any, i: number) => i !== index),
      });
    }
  }

  return (
    <div className="border  mb-5 rounded-md text-sm">
      <div className="bg-white p-3 rounded-t-md  font-medium">
        {mail.subject.trim() === "" ? "(no subject)" : mail.subject}
      </div>
      {/* From */}
      <div className="px-3 py-2 border-y flex items-center gap-4">
        <h6 className="text-gray-500">From</h6>
        <div className="flex items-center gap-2">
          <InitialsAvatar
            name={gmail?.data.name}
            className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-full text-xs"
          />
          <h6 className="capitalize text-base">{gmail?.data.name}</h6>
          <h6 className="text-gray-500 text-[13px]">{gmail?.data.email}</h6>
        </div>
      </div>
      {/* To */}
      <div className="px-3 py-2 border-b flex items-center gap-4">
        <h6 className="text-gray-500">To</h6>
        <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
          {mail.to.map((tag: any, index: number) => (
            <MailBadge
              key={index}
              text={tag}
              onClick={() => removeTag(index, "toRemove")}
            />
          ))}
          <input
            onKeyDown={(e) => handleKeyDown(e, "toAdd")}
            type="text"
            className="flex-grow  outline-none"
            placeholder="Recepient's Email"
          />
        </div>
        <div className="flex gap-2 text-blue-500 font-medium">
          {!mail.cc.isEnabled && (
            <h6
              className="cursor-pointer"
              onClick={() => dispatch({ type: "ccEnabled", payload: true })}
            >
              CC
            </h6>
          )}
          {!mail.bcc.isEnabled && (
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
      {mail.cc.isEnabled && (
        <div className="px-3 py-2 border-b flex items-center gap-4">
          <h6 className="text-gray-500">CC</h6>
          <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
            {mail.cc.value.map((tag: any, index: number) => (
              <MailBadge
                key={index}
                text={tag}
                color="yellow"
                onClick={() => removeTag(index, "ccValueRemove")}
              />
            ))}
            <input
              onKeyDown={() => handleKeyDown(event, "ccValueAdd")}
              type="text"
              className="flex-grow  outline-none"
              placeholder="Recepient's Email"
            />
          </div>
        </div>
      )}
      {/* BCC */}
      {mail.bcc.isEnabled && (
        <div className="px-3 py-2 border-b flex items-center gap-4">
          <h6 className="text-gray-500">BCC</h6>
          <div className="rounded-sm w-full flex items-center flex-wrap gap-2">
            {mail.bcc.value.map((tag: any, index: number) => (
              <MailBadge
                key={index}
                text={tag}
                color="green"
                onClick={() => removeTag(index, "bccValueRemove")}
              />
            ))}
            <input
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
            value={mail.subject}
            // onChange={(e) => setSubject(e.target.value)}
            onChange={(e) =>
              dispatch({ type: "subject", payload: e.target.value })
            }
          />
        </div>
        <div className="w-[40%] border-l">
          <ReactSelect placeholder="Choose a Template" />
        </div>
      </div>
      <Editor value={mail.body} setValue={setBody} />
      <div className="flex justify-between p-4">
        <div className="flex gap-3">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-full font-semibold"
            onClick={sendHandler}
          >
            Send
          </button>
          <button className="border text-gray-500 px-3 py-1 rounded-full font-semibold">
            Schedule
          </button>
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
