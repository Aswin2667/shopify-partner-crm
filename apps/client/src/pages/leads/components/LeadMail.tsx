import Compose from "@/pages/mail/components/Compose";
import IntegrateGmail from "@/pages/mail/components/integration-gmail";
import { useSelector } from "react-redux";
import MailThreadList from "./MailThreadList";
import MailThreadLayout from "../../mail/components/MailThreadLayout";

type Props = {};

const LeadMail = (props: Props) => {
  const { integrations } = useSelector((state: any) => state.integration);
  const mailIntegrations = integrations.filter(
    (integration: any) => integration.category === "MAIL_SERVICE"
  );

  return (
    <div>
      {mailIntegrations?.length > 0 ? (
        <div className="space-y-5">
          <Compose />
          <MailThreadLayout />
        </div>
      ) : (
        <IntegrateGmail />
      )}
    </div>
  );
};

export default LeadMail;
