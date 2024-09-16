import { useDispatch, useSelector } from "react-redux";
import { Mail } from "./components/mail";
import { accounts, mails } from "./data";
import IntegrateGmail from "./components/integration-gmail";
import { useQuery } from "@tanstack/react-query";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import IntegrationService from "@/services/IntegrationService";
import { useParams } from "react-router-dom";
import { organizationAction } from "@/redux/organizationSlice";
import MailService from "@/services/MailService";

export default function MailPage() {
  const dispatch = useDispatch();
  const { organizationId } = useParams();

  useQueryEvents(
    useQuery({
      queryKey: ["getAllMailsByOrgId", organizationId],
      queryFn: async () =>
        await MailService.getMailsByOrgId(organizationId as string),
    }),
    {
      onSuccess: (response: any) => {
        dispatch(organizationAction.setEmails(response.data));
      },
      onError: (error) => console.error(error),
    }
  );

  const { integrations } = useSelector((state: any) => state.integration);
  const { emails } = useSelector((state: any) => state.organization);
  console.log(emails);

  const mailIntegrations = integrations.filter(
    (integration: any) => integration.category === "MAIL_SERVICE"
  );

  return (
    <div className="p-4">
      {mailIntegrations.length > 0 ? (
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
