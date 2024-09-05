import * as React from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationAction } from "@/redux/organizationSlice";
import { useNavigate } from "react-router-dom";

interface OrgSwitcherProps {
  isCollapsed: boolean;
  organizations: {
    email: string;
    organization: {
      id: string;
      name: string;
      logo: string;
      description: string;
    };
    icon: React.ReactNode;
  }[];
}

 export default function OrgSwitcher({ isCollapsed, organizations }: OrgSwitcherProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current organization from Redux
  const currentOrganization = useSelector((state: any) => state.organization.currentOrganization);

  // Set the default account
  React.useEffect(() => {
    if (!currentOrganization && organizations.length > 0) {
      dispatch(organizationAction.setCurrentOrganization(organizations[0]?.organization?.name));
    }
  }, [currentOrganization, organizations, dispatch]);

  const handleOrganizationChange = (orgName: string) => {
    dispatch(organizationAction.setCurrentOrganization(orgName));
    navigate(`/${orgName}`);
  };

  return (
    <Select defaultValue={currentOrganization} onValueChange={handleOrganizationChange}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
           isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
 
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
           <img
            src={organizations.find((organization) => organization.organization.id === currentOrganization)?.organization.logo}
            alt="Org Logo"
            className="h-6 w-6"
          />
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {organizations.find((organization) => organization.organization.id === currentOrganization)?.organization.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-fit">
        {organizations.map((organization) => (
          <SelectItem key={organization.email} value={organization.organization.id}>
            <div className="flex items-center gap-3">
              <img src={organization.organization.logo} alt="Org Logo" className="h-6 w-6" />
              <div>
                <div className="text-sm font-semibold">{organization.organization.name}</div>
                <div className="text-xs">{organization.organization.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}