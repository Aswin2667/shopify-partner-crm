import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import SkeletonCard from "@/components/skelotons/SkeletonCard";
import { dataTagSymbol, useQuery } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { useDispatch, useSelector } from "react-redux";
import { useQueryEvents } from "@/hooks/useQueryEvents.tsx";
import { integrationAction } from "@/redux/integrationSlice";
import IntegrationCard from "./IntegrationCard";

export default function IntegrationDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { currentOrganization } = useSelector(
    (state: any) => state.organization
  );

  const { integrations } = useSelector((state: any) => state.integration);

  const { isLoading } = useQueryEvents(
    useQuery({
      queryKey: ["getAllIntegrations", currentOrganization.id],
      queryFn: async () =>
        await IntegrationService.getAllIntegrations(currentOrganization.id),
    }),
    {
      onSuccess: (data: any) =>
        dispatch(integrationAction.setIntegrations(data)),
      onError: (err: Error) => console.log("An error happened:", err.message),
    }
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(16)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : integrations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg min-h-fit border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no Integration at the moment
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start by creating a new integration
            </p>
            <Button
              onClick={() =>
                navigate(
                  `/${currentOrganization?.id}/create-integration`
                )
              }
            >
              Create
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {integrations.map((integration: any) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
