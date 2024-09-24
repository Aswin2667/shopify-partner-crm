import { useEffect, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Smile,
  Image,
  Link,
  MoreHorizontal,
  Trash2,
  ChevronUp,
  Copy,
  CircleMinus,
} from "lucide-react";
import EmailEditor from "./Editor";
import MailBadge from "./MailBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";

const menuItems = [
  { name: "REPLY", icon: <ArrowLeft className="h-4 w-4" /> },
  { name: "FORWARD", icon: <ArrowRight className="h-4 w-4" /> },
  // { name: "Edit subject", icon: null },
];

const initialArg = {
  from: null,
  to: [],
  cc: { isEnabled: false, value: [] },
  bcc: { isEnabled: false, value: [] },
  subject: "",
  body: "",
  isMenuOpen: false,
  showCcBcc: false,
};

const reducer = (prevState: any, action: any) => {
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
  if (action.type === "clear") {
    return initialArg;
  }
  return prevState;
};

export default function MailReply({
  actualMessageId,
  action,
  setAction,
  mail,
  messageHeaders,
  body,
}: any) {
  const queryClient = useQueryClient();

  const [reply, dispatch] = useReducer(reducer, initialArg, () => initialArg);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleItemClick = (item: string) => {
    setIsMenuOpen(false);
    setAction(item);
    // Add your logic here for what should happen when an item is selected
    console.log(`Selected: ${item}`);
  };

  console.log(mail);
  console.log(messageHeaders);
  console.log(body);
  console.log(actualMessageId);

  const { mutate: replyMail } = useMutation({
    mutationFn: async (data: any) =>
      IntegrationService.performAction(mail?.source, "RESPOND_MAIL", data),
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({
        queryKey: ["getThreadDetails", mail?.threadId, mail?.integrationId],
      });

      dispatch({ type: "clear" });
    },
    onError: (error) => console.error(error),
  });

  const replyMailHandler = () => {
    const replyData = {
      integrationId: mail?.integrationId,
      threadId: mail?.threadId,
      messageId: messageHeaders["Message-Id"] || messageHeaders["Message-ID"],
      recipient: reply.to,
      cc: reply.cc.isEnabled ? reply.cc.value : [],
      bcc: reply.bcc.isEnabled ? reply.bcc.value : [],
      subject: reply.subject,
      body: reply.body,
      action,
      actualMessageId,
    };
    console.log(replyData);

    reply.to.length === 0 && alert("Please specify at least one recipient.");
    replyMail(replyData);
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
        payload: reply.to.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "ccValueRemove") {
      dispatch({
        type,
        payload: reply.cc.value.filter((el: any, i: number) => i !== index),
      });
    }
    if (type === "bccValueRemove") {
      dispatch({
        type,
        payload: reply.bcc.value.filter((el: any, i: number) => i !== index),
      });
    }
  }

  useEffect(() => {
    body &&
      dispatch({
        type: "body",
        payload: `\n \n\n\n<blockquote>${body}</blockquote>`,
      });
  }, [body]);

  useEffect(() => {
    if (Object.keys(messageHeaders).length > 0) {
      dispatch({
        type: "subject",
        payload: messageHeaders["Subject"],
      });
    }
  }, [messageHeaders]);

  useEffect(() => {
    dispatch({
      type: "toRemove",
      payload: action === "REPLY" ? [messageHeaders["To"]] : [],
    });
    if (reply.cc.isEnabled) {
      dispatch({ type: "ccValueRemove", payload: [] });
      dispatch({ type: "ccEnabled", payload: false });
    }
    if (reply.bcc.isEnabled) {
      dispatch({ type: "bccValueRemove", payload: [] });
      dispatch({ type: "bccEnabled", payload: false });
    }
  }, [action]);

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 rounded-lg shadow my-2 border">
      <div className="space-y-2 mb-4">
        {/* To */}
        <div className="px-3 py-2 border-b flex items-center gap-4">
          <h6 className="text-gray-500">To</h6>
          <div className="rounded-sm w-full flex items-center flex-wrap gap-2 border p-2 bg-white">
            {reply.to.map((tag: any, index: number) => (
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
              className="flex-grow  outline-none "
              placeholder="Recepient's Email"
            />
          </div>
          <div className="flex gap-2 text-blue-500 font-medium">
            {!reply.cc.isEnabled && (
              <h6
                className="cursor-pointer"
                onClick={() => dispatch({ type: "ccEnabled", payload: true })}
              >
                CC
              </h6>
            )}
            {!reply.bcc.isEnabled && (
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
        {reply.cc.isEnabled && (
          <div className="px-3 py-2 border-b flex items-center gap-4">
            <h6 className="text-gray-500">CC</h6>
            <div className="rounded-sm w-full flex items-center flex-wrap gap-2 border p-2 bg-white">
              {reply.cc.value.map((tag: any, index: number) => (
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      dispatch({ type: "ccEnabled", payload: false })
                    }
                  >
                    <CircleMinus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Hide CC</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* BCC */}
        {reply.bcc.isEnabled && (
          <div className="px-3 py-2 border-b flex items-center gap-4">
            <h6 className="text-gray-500">BCC</h6>
            <div className="rounded-sm w-full flex items-center flex-wrap gap-2 border p-2 bg-white">
              {reply.bcc.value.map((tag: any, index: number) => (
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      dispatch({ type: "bccEnabled", payload: false })
                    }
                  >
                    <CircleMinus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Hide BCC</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Subject */}
      <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Subject"
          className="flex-grow mr-2"
          value={reply.subject}
          onChange={(e) =>
            dispatch({ type: "subject", payload: e.target.value })
          }
        />
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center min-w-[150px] justify-between"
            >
              <span className="flex items-center">
                {action ? (
                  <>
                    {menuItems.find((item) => item.name === action)?.icon}
                    <span className="ml-2">{action}</span>
                  </>
                ) : (
                  "Options"
                )}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className="flex items-center"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body */}
      <div className="w-full mb-4">
        <EmailEditor
          setValue={(value: any) => dispatch({ type: "body", payload: value })}
          value={reply.body}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Link className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setAction(null)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={replyMailHandler}>Send</Button>
        </div>
      </div>
    </div>
  );
}
