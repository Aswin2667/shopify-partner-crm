import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import OrganizationService from "@/services/OrganizationService";
import DateHelper from "@/utils/DateHelper";
import SkeletonCard from "@/components/skelotons/SkeletonCard";
import OrganizationCard from "../../organizations/OrganizationCard";
import CreateShopifyModal from "./CreateShopifyModal";

export default function IntegrationDashboard() {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [organizations, setOrganizations] = React.useState([]);
  const { toast } = useToast();
  const [reload] = React.useState(false);

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
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(16)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no Shopify Integration
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new shopify integration
            </p>
            <AlertDialogTrigger>
              <Button>Create</Button>
            </AlertDialogTrigger>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex items-center justify-end">
            <AlertDialogTrigger>
              <Button>Create</Button>
            </AlertDialogTrigger>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {organizations.map((organization, index) => (
              <OrganizationCard key={index} organization={organization} />
            ))}
          </div>
        </>
      )}
      <CreateShopifyModal />
    </main>
  );
}
