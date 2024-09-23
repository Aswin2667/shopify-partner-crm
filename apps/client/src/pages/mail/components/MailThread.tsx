import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Archive, ChevronDown, ChevronUp, Mail, Trash2 } from "lucide-react";
import MailThreadItem from "./MailThreadItem";
import IntegrationService from "@/services/IntegrationService";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { useSelector } from "react-redux";

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface Email {
  id: string;
  sender: string;
  recipients: string[];
  subject: string;
  content: string;
  timestamp: string;
  isStarred: boolean;
  labels: string[];
  attachments: Attachment[];
}

export const emails: Email[] = [
  {
    id: "1",
    sender: "John Doe",
    recipients: ["you@example.com", "team@example.com"],
    subject: "Re: Project Update",
    content: `
      <p>Thank you for the update. The progress looks good. Let's schedule a call to discuss the next steps.</p>
      <p>I've attached a document with some additional thoughts. Please review it before our call.</p>
    `,
    timestamp: "2 days ago",
    isStarred: false,
    labels: ["Work", "Important"],
    attachments: [
      {
        id: "a1",
        name: "thoughts.pdf",
        size: "2.3 MB",
        type: "application/pdf",
      },
    ],
  },
  {
    id: "2",
    sender: "Jane Smith",
    recipients: ["you@example.com", "john@example.com", "team@example.com"],
    subject: "Re: Project Update",
    content: `
      <p>I agree with John. I'd like to go over the timeline in more detail. Are you available for a quick call tomorrow?</p>
      <p>Also, I've updated the project roadmap. You can find it in the shared folder.</p>
    `,
    timestamp: "1 day ago",
    isStarred: true,
    labels: ["Work"],
    attachments: [],
  },
  {
    id: "3",
    sender: "You",
    recipients: ["john@example.com", "jane@example.com", "team@example.com"],
    subject: "Project Update",
    content: `
      <p>Here's the latest update on the project. We've completed phase 1 and are moving on to phase 2.</p>
      <p>Key points:</p>
      <ul>
        <li>Phase 1 deliverables are complete</li>
        <li>Phase 2 kickoff is scheduled for next week</li>
        <li>Budget is currently on track</li>
      </ul>
      <p>Let me know if you have any questions.</p>
    `,
    timestamp: "3 days ago",
    isStarred: false,
    labels: ["Work", "Sent"],
    attachments: [
      {
        id: "a2",
        name: "project_update.pptx",
        size: "5.7 MB",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
      {
        id: "a3",
        name: "budget.xlsx",
        size: "1.2 MB",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  },
];

type Thread = {
  id: string;
  historyId: string;
  messages: any[];
};

export default function MailThread({ mail }: any) {
  const [thread, setThread] = useState<null | Thread>(null);
  const [showAll, setShowAll] = useState(false);

  const integration = useSelector(
    (state: any) => state.integration.presentIntegrations
  )?.find((int: any) => int.type === mail?.source);

  const displayedMessages = showAll
    ? thread?.messages
    : thread?.messages.slice(0, 3);

  // console.log(thread);
  // console.log(mail);

  const { isFetching } = useQueryEvents(
    useQuery({
      queryKey: ["getThreadDetails", mail?.threadId, mail?.integrationId],
      queryFn: async () =>
        await IntegrationService.performAction(mail?.source, "GET_THREAD", {
          threadId: mail?.threadId,
          integrationId: mail?.integrationId,
        }),
      enabled: !!mail?.threadId, // Ensures query runs only when threadId exists
      // staleTime: 0, // Adjust stale time if necessary
      // cacheTime: 0, // Adjust cache time if necessary
    }),
    {
      onSuccess: (response: any) => {
        console.log(response);
        setThread(response);
      },
      onError: (error: any) => console.error(error),
    }
  );

  const handleArchive = (id: string) => {
    console.log(`Archiving email ${id}`);
  };  

  const handleDelete = (id: string) => {
    console.log(`Deleting email ${id}`);
  };

  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <Mail size={18} className="text-blue-900 dark:text-white" />
      </span>
      <TooltipProvider>
        <div className="max-w-full mx-auto py-3 px-4 space-y-4 border rounded bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{mail?.subject}</h1>
            <div className="gap-2 flex items-center justify-center">
              <img src={integration.logo} alt="" className="h-7 w-7 mr-3" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleArchive(mail?.id)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(mail?.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          {isFetching ? (
            <MailSkeleton />
          ) : (
            thread &&
            displayedMessages?.map((message: any) => (
              <MailThreadItem key={message.id} message={message} mail={mail} />
            ))
          )}
          {thread && thread?.messages.length > 3 && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Hide <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  View More <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </TooltipProvider>
    </li>
  );
}

const MailSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-24" />
      </CardHeader>
    </Card>
  );
};
