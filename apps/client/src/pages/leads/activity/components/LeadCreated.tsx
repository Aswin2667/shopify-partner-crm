import ProfileHoverCard from "@/components/HoverCard";
import DateHelper from "@/utils/DateHelper";
import TimeAgo from "timeago-react";

const LeadCreated = ({activity}:any) => {
    const { user } = activity;
    return (
      <li className="mb-10 ms-6">
        <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <img
            className="rounded-full shadow-lg"
            src={user.avatarUrl || ""}
            alt="Bonnie image"
            referrerPolicy="no-referrer"
          />
        </span>
        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            <TimeAgo
              datetime={DateHelper.convertToDateString(activity.createdAt)}
            />
          </time>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
            {activity.data.message + " "}
            <ProfileHoverCard user={user} />
          </div>
        </div>
      </li>
    );
}

export default LeadCreated