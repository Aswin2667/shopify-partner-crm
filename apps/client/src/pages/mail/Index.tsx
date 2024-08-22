import { useDispatch, useSelector } from "react-redux";
import { Mail } from "./components/mail";
import { accounts, mails } from "./data";
import IntegrateGmail from "./components/integration-gmail";
import { useQuery } from "@tanstack/react-query";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import IntegrationService from "@/services/IntegrationService";
import { useParams } from "react-router-dom";
import { integrationAction } from "@/redux/integrationSlice";

export default function MailPage() {
  const { organizationId } = useParams();
  const dispatch = useDispatch();
  const { gmail } = useSelector((state: any) => state.integration);

  useQueryEvents(
    useQuery({
      queryKey: ["getGmailIntegration4Org"],
      queryFn: async () =>
        await IntegrationService.getGmailIntegration(organizationId || ""),
      // enabled: !gmail,
    }),
    {
      onSuccess: (data) =>
        dispatch(integrationAction.setGmailIntegration(data)),
      onError: (error: any) =>
        error.response.data.statusCode === 404 &&
        dispatch(integrationAction.setGmailIntegration(null)),
    }
  );

  return (
    <div className="p-4">
      {gmail ? (
        <Mail
          accounts={accounts}
          mails={mails}
          navCollapsedSize={4}
          defaultLayout={undefined}
        />
      ) : (
        <IntegrateGmail />
      )}
    </div>
  );
}
