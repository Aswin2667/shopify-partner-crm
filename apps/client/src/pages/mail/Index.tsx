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
  const dispatch = useDispatch();
  const { organizationId } = useParams();

  const { integrations } = useSelector((state: any) => state.integration);

  const gmailIntegrations = integrations.filter(
    (integration: any) => integration.type === "GMAIL"
  );
  return (
    <div className="p-4">
      {gmailIntegrations ? (
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
