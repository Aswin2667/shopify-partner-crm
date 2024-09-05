import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrgSwitcherProps {
  isCollapsed: boolean;
  organizations: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
}

export default function OrgSwitcher({
  isCollapsed,
  organizations,
}: OrgSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    organizations[0].email
  );

  return (
    <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {
            organizations.find(
              (organization) => organization.email === selectedAccount
            )?.icon
          }
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              organizations.find(
                (organization) => organization.email === selectedAccount
              )?.label
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-fit">
        {organizations.map((organization) => (
          <SelectItem key={organization.email} value={organization.email}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {organization.icon}
              {organization.email}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
