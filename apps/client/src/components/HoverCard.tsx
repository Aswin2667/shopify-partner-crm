import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import DateHelper from "@/utils/DateHelper";

export default function ProfileHoverCard({ user, createdAt }: any) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="font-semibold p-0 mr-2 text-blue-600 dark:text-blue-500 hover:underline"
        >
          {user?.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-fit">
            <h4 className="text-sm font-semibold">{user?.name}</h4>
            <div className="flex items-center min-w-fit pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                {DateHelper.formatTimestamp(createdAt ?? "")}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
