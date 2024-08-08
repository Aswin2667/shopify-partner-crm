import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  Building,
  Inbox,
  LayoutGrid,
  MessagesSquare,
  Search,
  ShoppingCart,
  User,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./Navbar";
import OrgSwitcher from "./OrgSwitcher";
import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";
import { UserNav } from "./ui/userNav";
import Loader from "./Loader";

export default function RootLayout() {
  const defaultLayout = [17, 32];
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navCollapsedSize = undefined;
  const navigate = useNavigate();

  // Organizations data
  const organizations = [
    {
      label: "Alicia Koch",
      email: "alicia@example.com",
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Vercel</title>
          <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Alicia Koch",
      email: "alicia@gmail.com",
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Gmail</title>
          <path
            d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      label: "Alicia Koch",
      email: "alicia@me.com",
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>iCloud</title>
          <path
            d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  React.useEffect(() => {
    const sessionData = sessionStorage.getItem("sessionData");
    if (sessionData) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <TooltipProvider delayDuration={0}>
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
                title: "Inbox",
                label: "128",
                icon: Inbox,
                variant: "default",
              },
              {
                title: "Leads",
                label: "9",
                icon: Building,
                variant: "ghost",
              },
              {
                title: "Contacts",
                label: "",
                icon: User,
                variant: "ghost",
              },
              {
                title: "Apps",
                label: "",
                icon: LayoutGrid,
                variant: "ghost",
              },
              {
                title: "Workflows",
                label: "23",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Archive",
                label: "",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          />
          <Separator />
          <Navbar
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Social",
                label: "972",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Forums",
                label: "128",
                icon: MessagesSquare,
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                variant: "ghost",
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
                title: "Integration",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Settings",
                label: "21",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          />
         </div>
         </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="h-screen">
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
              <UserNav />
            </div>
          </div>
          <Separator />
          <div className="max-h-full max-w-full min-w-full flex items-center justify-center">
            <div className="max-h-screen max-w-full min-h-screen min-w-full overflow-auto">
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}