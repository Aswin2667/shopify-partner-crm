import Compose from "@/pages/mail/components/Compose";
import IntegrateGmail from "@/pages/mail/components/integration-gmail";
import { useSelector } from "react-redux";
import MailThread from "./MailThreadList";

type Props = {};

const LeadMail = (props: Props) => {
  const { integrations } = useSelector((state: any) => state.integration);
  const mailIntegrations = integrations.filter(
    (integration: any) => integration.category === "MAIL_SERVICE"
  );

  return (
    <div>
      {mailIntegrations?.length > 0 ? (
        <div>
          <Compose />
          <MailThread />
        </div>
      ) : (
        <IntegrateGmail />
      )}
    </div>
  );
};

export default LeadMail;
