
  import { Home, Menu, Package2, Search } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { Outlet, useNavigate } from "react-router-dom";
  import React from "react";
  import Loader from "@/components/Loader";
  import { UserNav } from "@/components/ui/userNav";
  import { useToast } from "@/components/ui/use-toast";
  import OrganizationService from "@/services/OrganizationService";
  import DateHelper from "@/utils/DateHelper";
  import CreateShopifyModal from "./CreateShopifyModal";
  
  export default function IntegrationDashboardLayout() {
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const [organizations, setOrganizations] = React.useState([]);
    const { toast } = useToast();
    const [reload, setReload] = React.useState(false);
  
    const fetchOrganizations = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("session") ?? "").id;
        const response: any =
          await OrganizationService.getOrganizationsByUserId(userId);
        setOrganizations(response.data.data);
        if (!response.status) {
          toast({
            title: response.message,
            description: DateHelper.formatTimestamp(
              DateHelper.getCurrentUnixTime()
            ),
            duration: 1000,
            variant: `${response.status ? "default" : "destructive"}`,
          });
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    React.useEffect(() => {
      const sessionData = sessionStorage.getItem("session");
      if (!sessionData) {
        navigate("/login");
      } else {
        fetchOrganizations();
  
        setLoading(false);
      }
    }, [navigate, reload]);
  
    if (loading) {
      return <Loader />;
    }
  
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
                  My Integrations
                </a>
              </nav>
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
                    My Integrations
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
                    placeholder="Search Integrations..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            {/* <UserNav /> */}
          </header>
          <Outlet />
        </div>
        <CreateShopifyModal />
      </div>
    );
  }
  