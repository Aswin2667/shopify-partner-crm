import { useEffect, useState } from "react";
import { GoChevronRight, GoChevronDown } from "react-icons/go";

const MailThreadItem = ({ thread }: any) => {
  const [emailHeaders, setEmailHeaders] = useState({} as any);
  const [threadIsOpen, setThreadIsOpen] = useState(false);

  console.log(thread);

  useEffect(() => {
    const emailHeadersObject = thread?.payload.headers.reduce(
      (acc: any, current: any) => {
        acc[current.name] = current.value;
        return acc;
      },
      {}
    );
    setEmailHeaders(emailHeadersObject);
  }, [thread]);

  return (
    <div
      className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-pointer"
      onClick={() => setThreadIsOpen((prevState) => !prevState)}
    >
      {!threadIsOpen && (
        <div className="flex items-center">
          <div>
            <GoChevronRight size={15} />
          </div>
          <h1 className="truncate pr-2 pl-3">{emailHeaders["From"]}</h1>
          <h1 className="truncate">{thread?.snippet}</h1>
        </div>
      )}
      {threadIsOpen && (
        <div className="flex gap-2">
          <GoChevronDown size={15} />
          <div className="space-y-1">
            <h1>From : {emailHeaders["From"]}</h1>
            <h1>To: {emailHeaders["To"]}</h1>
            <h1>{emailHeaders["Subject"]}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailThreadItem;
