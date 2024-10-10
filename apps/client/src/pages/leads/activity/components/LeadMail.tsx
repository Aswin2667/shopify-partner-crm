import MailThread from "@/pages/mail/components/MailThread";

const LeadMail = ({ activity }: any) => {
  return <MailThread mail={activity.data.data} />;
};

export default LeadMail;
