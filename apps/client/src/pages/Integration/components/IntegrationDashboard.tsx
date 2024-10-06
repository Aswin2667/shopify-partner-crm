import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import SkeletonCard from "@/components/skelotons/SkeletonCard";
import { useQuery } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { useDispatch, useSelector } from "react-redux";
import { useQueryEvents } from "@/hooks/useQueryEvents.tsx";
import { integrationAction } from "@/redux/integrationSlice";
import IntegrationCard from "./IntegrationCard";
import { Separator } from "@/components/ui/separator";

export default function IntegrationDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { organizationId } = useParams();
  const [orgMemberId, setOrgMemberId] = React.useState<string | null>(null);

  const { integrations } = useSelector((state: any) => state.integration);
  const { currentOrgMember } = useSelector((state: any) => state.organization);

  const presentIntegration = [
    ...new Set(integrations.map((integration: any) => integration.type)),
  ] as string[];
  console.log(presentIntegration);

  const { isLoading } = useQueryEvents(
    useQuery({
      queryKey: ["getAllIntegrationsPresentInOrg", organizationId],
      queryFn: async () =>
        await IntegrationService.getAllIntegrationsByOrgId(
          organizationId as string,
          (orgMemberId as string) || currentOrgMember?.id
        ),
    }),
    {
      onSuccess: (data: any) =>
        dispatch(integrationAction.setIntegrations(data)),
      onError: (err: Error) => console.log("An error happened:", err.message),
    }
  );

  React.useEffect(() => {
    const orgMemberDetails = localStorage.getItem("presentOrgMemberDetails");
    if (orgMemberDetails) {
      const parsedDetails = JSON.parse(orgMemberDetails);
      setOrgMemberId(parsedDetails?.id); // Set orgMemberId from localStorage
    }
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Integrations</h3>
            <p className="text-sm text-muted-foreground">
              Manage your third-party integrations. Turn services on or off to
              control which integrations are active in your app.
            </p>
          </div>
          {!isLoading && (
            <Button onClick={() => navigate(`create`)}>Create</Button>
          )}
        </div>
        <Separator />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(16)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : integrations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg py-20">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no Integration at the moment
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new integration
            </p>
            <Button onClick={() => navigate(`create`)}>Create</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {presentIntegration.map((type: string, index: number) => (
              <IntegrationCard key={index} type={type} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
