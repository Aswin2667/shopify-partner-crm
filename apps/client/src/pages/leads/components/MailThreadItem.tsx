import React, { useEffect, useState } from "react";

const MailThreadItem = ({ thread }: any) => {
  const [emailHeaders, setEmailHeaders] = useState({} as any);
  console.log(thread);
  console.log(emailHeaders);
  useEffect(() => {
    const emailHeadersObject = thread.payload.headers.reduce(
      (acc: any, current: any) => {
        acc[current.name] = current.value;
        return acc;
      },
      {}
    );
    setEmailHeaders(emailHeadersObject);
  }, [thread]);

  return (
    <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
      <h1>From : {emailHeaders["From"]}</h1>
      <h1>To: {emailHeaders["To"]}</h1>
      <h1>{emailHeaders["Subject"]}</h1>
      <h1>{thread?.snippet}</h1>
    </div>
  );
};

export default MailThreadItem;
