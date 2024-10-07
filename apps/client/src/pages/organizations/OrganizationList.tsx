import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  CalendarDays,
  Edit,
  Home,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import OrganizationService from "@/services/OrganizationService";
import DateHelper from "@/utils/DateHelper";
import SkeletonCard from "@/components/skelotons/SkeletonCard";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { organizationAction } from "@/redux/organizationSlice";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { integrationAction } from "@/redux/integrationSlice";
import CreateOrganization from "./CreateOrganization";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface Organization {
  id: number;
  name: string;
  logo: string;
  description: string;
  createdAt: string;
  memberCount: number;
  industry: string;
  tags: string[];
}
export default function OrganizationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [reload, setReload] = React.useState(true);
  const { organizations } = useSelector((state: any) => state.organization);
  const [, setEditingOrg] = useState<Organization | null>(null);

  useEffect(() => {
    dispatch(organizationAction.reset());
    dispatch(integrationAction.reset());
    localStorage.removeItem("presentOrgMemberDetails");
  }, []);

  const { isLoading } = useQueryEvents(
    useQuery({
      queryKey: ["fetchOrganizations"],
      queryFn: async () => {
        try {
          const userId = JSON.parse(localStorage.getItem("session") ?? "").id;
          return await OrganizationService.getOrganizationsByUserId(userId);
        } catch (error) {}
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }),
    {
      onSuccess: (response: any) => {
        dispatch(organizationAction.setOrganizations(response.data.data));
        localStorage.setItem(
          "organizations",
          JSON.stringify(response.data.data)
        );
      },
      onError: (error: any) => {
        toast({
          title: error.message,
          description: DateHelper.formatTimestamp(
            DateHelper.getCurrentUnixTime()
          ),
          duration: 1000,
          variant: "destructive",
        });
      },
    }
  );

  React.useEffect(() => {
    const sessionData = localStorage.getItem("session");
    if (!sessionData) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">CRM</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                My Organizations
              </a>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">CRM</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  My Organizations
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can start by creating a new organization or join by
                  invitation
                </p>
                <AlertDialogTrigger asChild>
                  <Button>Create new Organization</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="p-0">
                  <CreateOrganization setReload={setReload} reload={reload} />
                </AlertDialogContent>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex items-center justify-end">
                <AlertDialogTrigger asChild>
                  <Button>Create Organization</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="p-0">
                  <CreateOrganization setReload={setReload} reload={reload} />
                </AlertDialogContent>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {false
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : organizations.map((org: Organization) => (
                      <>
                        <OrganizationCard
                          key={org.id}
                          org={org}
                          onEdit={setEditingOrg}
                          setReload={setReload} 
                          reload={reload}
                        />
                      </>
                    ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const OrganizationCard: React.FC<{
  org: any;
  onEdit: (org: Organization) => void;
  setReload: any;
  reload: boolean;
}> = ({ org, onEdit , setReload,
  reload}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clickHandler = () => {
    console.log(org);
    dispatch(organizationAction.setCurrentOrgMember(org));
    navigate(`/${org.organizationId}/dashboard`);
    // localStorage.setItem("organization", JSON.stringify(organization));
  };
  return (
    <AlertDialog>
      <Card className="  overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-20 w-20 rounded-xl">
            <AvatarImage
              src={org.organization.logo}
              alt={org.organization.name}
            />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {org.organization.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-2xl font-bold leading-none">
            {org.organization.name}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{org.industry}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {org?.organization?.details?.tags.map(
                (
                  tag:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | null | undefined
                ) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
            {org.organization.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-4 border-t">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {org.organization.createdAt}
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />9 members
            </div>
          </div>
          <div className="flex justify-between w-full">
            <AlertDialogTrigger>
              <Button variant="outline" onClick={() => onEdit(org)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </AlertDialogTrigger>
            <Button variant="outline" onClick={clickHandler}>
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <AlertDialogContent className="p-0">
        <CreateOrganization
          setReload={setReload}
          reload={reload}
          organization={org}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};