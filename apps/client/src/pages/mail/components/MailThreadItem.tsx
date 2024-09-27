import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  CornerUpRight,
  Reply,
  ReplyAll,
  Star,
  MoreHorizontal,
  Paperclip,
  Download,
  Flag,
  Tag,
} from "lucide-react";
import { emails } from "./MailThread";
import MailReply from "./MailReply";
import TimeAgo from "timeago-react";
import DateHelper from "@/utils/DateHelper";
// @ts-ignore
import DOMPurify from "dompurify";
import { is } from "date-fns/locale";

const MailThreadItem = ({ message, mail }: any) => {
  const [action, setAction] = useState<null | string>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messageHeaders, setMessageHeaders] = useState({} as any);
  const [body, setBody] = useState("");

  const isGmail = message && mail ? true : false;

  const toggleStar = (id: string) => {
    console.log(`Toggled star for email ${id}`);
  };

  const handleReply = (id: string) => {
    setAction("REPLY");
    console.log(`Replying to email ${id}`);
  };

  const handleReplyAll = (id: string) => {
    console.log(`Replying to all for email ${id}`);
  };

  const handleForward = (id: string) => {
    setAction("FORWARD");
    console.log(`Forwarding email ${id}`);
  };

  const handleDownload = (attachmentId: string) => {
    console.log(`Downloading attachment ${attachmentId}`);
  };

  function getInitials(name: string): string {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getAvatarColor(name: string): string {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    const index =
      name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  }

  const handleFlag = (id: string) => {
    console.log(`Flagging email ${id}`);
  };

  const handleAddLabel = (id: string) => {
    console.log(`Adding label to email ${id}`);
  };

  useEffect(() => {
    const fixBase64 = (str: any) => {
      // Replace URL-safe characters with standard Base64 characters
      str = str.replace(/-/g, "+").replace(/_/g, "/");

      // Add padding if necessary
      while (str.length % 4 !== 0) {
        str += "=";
      }

      return str;
    };

    if (message) {
      // Extract headers
      const headersObject = message.payload.headers.reduce(
        (acc: Record<string, string>, { name, value }: any) => {
          acc[name] = value;
          return acc;
        },
        {}
      );
      setMessageHeaders(headersObject);

      // Decode body
      const { body, mimeType, parts } = message.payload;
      if (body?.data) {
        setBody(atob(fixBase64(body.data)));
      } else if (mimeType === "multipart/alternative" && parts?.length > 0) {
        setBody(atob(fixBase64(parts[0].body.data)));
      }
    }
  }, [message]);

  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2 pt-4 px-4">
        <Avatar
          className={`h-10 w-10 ${getAvatarColor(isGmail ? messageHeaders["From"] : mail.from.name)}`}
        >
          <AvatarFallback>
            {getInitials(isGmail ? messageHeaders["From"] : mail.from.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">
            {isGmail
              ? messageHeaders["From"]
              : `${mail.from.name} <${mail.from.email}>`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            To: {isGmail ? messageHeaders["To"] : mail.to.join(", ")}
            {/* .join(", ") */}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            <TimeAgo
              datetime={DateHelper.convertToDateString(
                isGmail
                  ? DateHelper.convertToUnixTimestamp(messageHeaders["Date"])
                  : mail.sentAt
              )}
            />
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStar("email.id")}
            aria-label={"email.isStarred" ? "Unstar email" : "Star email"}
          >
            <Star
              className={`h-4 w-4 ${"email.isStarred" ? "fill-yellow-400" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded((prevState) => !prevState)}
            aria-label={isExpanded ? "Collapse email" : "Expand email"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className={`pt-4 pb-4 ${isExpanded ? "" : "hidden"}`}>
        <h3 className="font-semibold mb-2">
          {isGmail ? messageHeaders["Subject"] : mail.subject}
        </h3>
        <div
          className="text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: isGmail ? body : mail.body }}
        />

        {isGmail && (
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReply("email.id")}
                className={`${action === "REPLY" ? "bg-accent" : ""}`}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              {/* <Button
              variant="outline"
              size="sm"
              onClick={() => handleReplyAll("email.id")}
              className={`${action === "REPLY_ALL" ? "bg-accent" : ""}`}
            >
              <ReplyAll className="h-4 w-4 mr-2" />
              Reply All
            </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleForward("email.id")}
                className={`${action === "FORWARD" ? "bg-accent" : ""}`}
              >
                <CornerUpRight className="h-4 w-4 mr-2" />
                Forward
              </Button>
            </div>
          </div>
        )}
        {isGmail && action && (
          <MailReply
            actualMessageId={message?.id}
            action={action}
            setAction={setAction}
            mail={mail}
            messageHeaders={messageHeaders}
            body={body}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MailThreadItem;

{
  /* {email.attachments.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Attachments:</h4>
            <div className="space-y-2">
              {email.attachments.map((attachment: any) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4" />
                    <span>{attachment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({attachment.size})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(attachment.id)}
                    aria-label={`Download ${attachment.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
         <div className="flex flex-wrap gap-2 mb-4">
          {email.labels.map((label: any) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </div> */
}
