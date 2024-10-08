import ProfileHoverCard from "@/components/HoverCard";
import DateHelper from "@/utils/DateHelper";
import TimeAgo from "timeago-react";
function LeadNoteCreated({activity}:any) {
    const { user } = activity;
    return (
      <li className="mb-10 ms-6">
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <img
            className="rounded-full shadow-lg"
            src={user.avatarUrl || ""}
            alt="Bonnie image"
            referrerPolicy="no-referrer"
          />
        </span>
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
          <div className="items-center justify-between mb-3 sm:flex">
            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
              <TimeAgo
                datetime={DateHelper.convertToDateString(activity.createdAt)}
              />
            </time>
            <div className="text-sm font-normal text-gray-500 lex dark:text-gray-300">
              <ProfileHoverCard user={user} />
              added a note
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: activity.data.data }}
            className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
          ></div>
        </div>
      </li>
    );
}

export default LeadNoteCreated