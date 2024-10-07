import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMailOpenOutline, IoMailOutline } from "react-icons/io5";
import TimeAgo from "timeago-react";
import DateHelper from "../../../utils/DateHelper";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

const MailDisplay = ({ mail }: any) => {
  const { organizationId } = useParams();

  const integration = useSelector(
    (state: any) => state.integration.presentIntegrations
  )?.find((int: any) => int.type === mail?.source);

  const toggleArchive = (id: number) => {
    console.log("Archive " + id);
  };

  const openEmail = (id: number) => {
    console.log("Open " + id);
  };
  return (
    <NavLink
      key={mail.id}
      className={`flex items-center p-4 border-b hover:bg-gray-50 ${!"mail.read" ? "bg-blue-50" : ""}`}
      to={`/${organizationId}/leads/${mail.leadId}/emails`}
    >
      <img src={integration.logo} alt="" className="h-7 w-7 mr-3" />
      <Avatar className="ml-2">
        <AvatarFallback className="capitalize">
          {mail.from.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1" onClick={() => openEmail(mail.id)}>
        <div className="flex justify-between">
          <span
            className={`font-semibold capitalize ${!mail.read ? "text-black" : "text-gray-600"}`}
          >
            {mail.from.name}
          </span>
        </div>
        <div className="text-sm">
          <span className={`${!mail.read ? "font-semibold" : ""}`}>
            {mail.subject}
          </span>
          <span className="text-gray-500 ">
            {" "}
            - {mail.body.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 180)}...
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleArchive(mail.id)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {mail.archived ? "Unarchive" : "Archive"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {mail.status === "SEND" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleArchive(mail.id)}
                >
                  {mail.isOpened ? (
                    <IoMailOpenOutline size={16} />
                  ) : (
                    <IoMailOutline size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <h6 className="text-sm">
                  {mail.isOpened
                    ? `Opened At: ${DateHelper.convertToDateString(mail.openedAt)}`
                    : `Not Opened Yet!`}
                </h6>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="text-sm text-gray-500 text-center">
          {mail.sentAt !== "0" && (
            <TimeAgo datetime={DateHelper.convertToDateString(mail.sentAt)} />
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default MailDisplay;
