import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useParams } from "react-router-dom";
import MailService from "@/services/MailService";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import MailThread from "./MailThread";
type Props = {};

const MailThreadLayout = (props: Props) => {
  const { leadId } = useParams();

  const [mailsForLead, setMailsForLead] = useState([]);
  console.log(mailsForLead);

  useQueryEvents(
    useQuery({
      queryKey: ["getAllMailsByLeadId", leadId],
      queryFn: async () => await MailService.getMailsByLeadId(leadId as string),
      enabled: !!leadId,
    }),
    {
      onSuccess: (response: any) => {
        setMailsForLead(response);
        // dispatch(organizationAction.setEmails(response));
      },
      onError: (error) => console.error(error),
    }
  );

  return (
    <ol className="relative border-s w-full border-gray-200 dark:border-gray-700 list-none space-y-2 py-8">
      {mailsForLead.length > 0 &&
        mailsForLead?.map((mail: any) => <MailThread mail={mail} />)}
    </ol>
  );
};

export default MailThreadLayout;
