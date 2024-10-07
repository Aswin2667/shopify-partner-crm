import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "../use-mail";
import { NavLink, useParams } from "react-router-dom";
import { IoMailOutline, IoMailOpenOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MailListProps {
  items: any[];
}

export function MailList({ items }: MailListProps) {
  const { organizationId } = useParams();
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center justify-between gap-2 w-full">
                  <NavLink
                    className="font-semibold hover:text-blue-600 underline transition-all ease-linear capitalize"
                    to={`/${organizationId}/leads/${item.leadId}/emails`}
                  >
                    {item.from.name}
                  </NavLink>
                  {item.status === "SEND" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          {item.isOpened ? (
                            <IoMailOpenOutline size={16} />
                          ) : (
                            <IoMailOutline size={16} />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <h6 className="text-sm">
                          {item.isOpened
                            ? `Opened At: ${item.openedAt}`
                            : `Not Opened Yet!`}
                        </h6>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            {/* const decodedHtml = encodedHtml.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">");
             */}
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.body.replace(/<\/?[^>]+(>|$)/g, "")}
            </div>
            <Badge variant={getBadgeVariantFromLabel("label")}>
              {item.status}
            </Badge>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
