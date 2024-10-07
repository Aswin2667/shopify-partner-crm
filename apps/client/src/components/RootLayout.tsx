import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Inbox,
  Building,
  User,
  ArchiveX,
  Folder,
  Settings,
  ClipboardList,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import Navbar from "./Navbar";
import OrgSwitcher from "./OrgSwitcher";
import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useQuery } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { useDispatch, useSelector } from "react-redux";
import { integrationAction } from "@/redux/integrationSlice";
import { mailAction } from "@/redux/mailSlice";
import { organizationAction } from "@/redux/organizationSlice";
import UnsubscribeLinkService from "@/services/UnSubscribeLinkService";

const defaultLayout = [17, 32];
export default function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { organizationId } = useParams();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navCollapsedSize = undefined;

  // Fetch currentOrgMember and organizations from the Redux store
  const { organizations, currentOrgMember } = useSelector(
    (state: any) => state.organization
  );

  useQueryEvents(
    useQuery({
      queryKey: ["getAllIntegrationsPresentInOrg", organizationId],
      queryFn: async () =>
        await IntegrationService.getAllIntegrationsByOrgId(
          organizationId as string,
          currentOrgMember?.id
        ),
      enabled: !!organizationId,
    }),
    {
      onSuccess: (response: any) => {
        dispatch(integrationAction.setIntegrations(response));
        // TODO: Can this be writen as its own GET Query
        dispatch(
          mailAction.setSendAs(
            response.flatMap(
              (integration: any) => integration.mailServiceFromEmail
            )
          )
        );
      },
      onError: (error: any) => console.log(error),
    }
  );

  useQueryEvents(
    useQuery({
      queryKey: ["getAllAvailableIntegration"],
      queryFn: async () =>
        await IntegrationService.getPresentIntegrationsList(),
    }),
    {
      onSuccess: (data) =>
        dispatch(integrationAction.setPresentIntegrations(data)),
      onError: (error) => console.error(error),
    }
  );

  useQueryEvents(
    useQuery({
      queryKey: ["getUnsubscribeLinks", organizationId],
      queryFn: async () =>
        await UnsubscribeLinkService.getByOrgId(organizationId ?? ""),
    }),
    {
      onSuccess: (response) =>
        dispatch(organizationAction.setUnsubscribeLinks(response?.data.data)),
      onError: (error) => console.error(error),
    }
  );

  React.useEffect(() => {
    const sessionData = localStorage.getItem("session");
    if (!sessionData) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    if (organizationId !== currentOrgMember?.organizationId) {
      navigate("/");
    }
  }, [organizationId, currentOrgMember?.organizationId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
          sizes
        )}`;
      }}
      className="min-h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={5}
        maxSize={10}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onResize={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed
            ? "min-w-[50px] transition-all duration-300 ease-in-out "
            : "h-screen sticky top-0"
        )}
      >
        <div
          className={cn(
            "flex h-[52px] items-center justify-center",
            isCollapsed ? "h-[52px]" : "px-2"
          )}
        >
          {/* Pass organizations to the OrgSwitcher */}
          <OrgSwitcher
            isCollapsed={isCollapsed}
            organizations={organizations}
          />
        </div>
        <Separator />
        <div className="flex gap-3 flex-col justify-between h-fit">
          <div className="">
            <Navbar
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Dashboard",
                  label: "128",
                  icon: LayoutDashboard,
                  variant: "default",
                  url: "dashboard",
                },
                {
                  title: "Inbox",
                  label: "128",
                  icon: Inbox,
                  variant: "default",
                  url: "inbox",
                },
                {
                  title: "Leads",
                  label: "9",
                  icon: Building,
                  variant: "ghost",
                  url: "leads",
                },
                {
                  title: "Contacts",
                  label: "",
                  icon: User,
                  variant: "ghost",
                  url: "contacts",
                },
                {
                  title: "Workflows",
                  label: "23",
                  icon: ArchiveX,
                  variant: "ghost",
                  url: "workflows",
                },
                {
                  title: "Tasks",
                  label: "0",
                  icon: ClipboardList,
                  variant: "ghost",
                  url: "tasks",
                },
                {
                  title: "Media Library",
                  label: "",
                  icon: Folder,
                  variant: "ghost",
                  url: "media library",
                },
              ]}
            />
          </div>
          <div>
            <Separator />
            <Navbar
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Settings",
                  label: "21",
                  icon: Settings,
                  variant: "ghost",
                  url: "settings",
                },
              ]}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={30}
        className="h-screen"
      >
        <div className="flex items-center px-4 justify-between">
          <div className="bg-background/95 p-[6px] backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* <UserNav /> */}
          </div>
        </div>
        <Separator />
        <div className="max-h-full max-w-full min-w-full flex items-center justify-center">
          <div className="max-h-screen max-w-full min-h-screen min-w-full overflow-scroll">
            <Outlet />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
