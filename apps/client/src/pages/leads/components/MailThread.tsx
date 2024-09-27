import React, { useEffect, useState } from "react";
import MailThreadItem from "./MailThreadItem";
import IntegrationService from "@/services/IntegrationService";
import DateHelper from "../../../utils/DateHelper";
import TimeAgo from "timeago-react";

type Thread = {
  id: string;
  historyId: string;
  messages: any[];
};

const MailThread = ({ mail }: any) => {
  const [thread, setThread] = useState<null | Thread>(null);
  console.log(mail);
  // console.log(thread);

  useEffect(() => {
    const getTheadDetails = async () => {
      const response = await IntegrationService.performAction(
        "GMAIL",
        "GET_THREAD",
        {
          threadId: mail?.threadId,
          integrationId: mail?.integrationId,
        }
      );

      setThread(response);
    };

    if (mail?.threadId) getTheadDetails();
  }, [mail?.threadId]);

  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <img
          className="rounded-full shadow-lg"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="Thomas Lean image"
        />
      </span>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
        <div className="items-center justify-between mb-3 sm:flex">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            <TimeAgo datetime={DateHelper.convertToDateString(mail?.sentAt)} />
          </time>
          <div className=" text-sm font-semibold text-gray-900 dark:text-white hover:underline">
            {mail.subject}{" "}
          </div>
        </div>
        <div className="space-y-2">
          {thread &&
            thread?.messages.map((thread: any) => (
              <MailThreadItem thread={thread} />
            ))}
        </div>
      </div>
    </li>
  );
};

export default MailThread;
