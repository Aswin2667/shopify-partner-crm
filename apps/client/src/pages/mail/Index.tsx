import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { organizationAction } from "@/redux/organizationSlice";
import MailService from "@/services/MailService";
import MailInbox from "./components/Inbox";
import EmptyInbox from "./components/EmptyInbox";

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
        dispatch(organizationAction.setEmails(response));
      },
      onError: (error) => console.error(error),
    }
  );

  const { emails } = useSelector((state: any) => state.organization);
  console.log(emails);

  return (
    <div className="p-4">
      {emails?.length > 0 ? <MailInbox mails={emails} /> : <EmptyInbox />}
    </div>
  );
}
