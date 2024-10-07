import image from "../../../../assets/shopify-logo.svg";
import DateHelper from "@/utils/DateHelper";
import { ArrowRight } from "lucide-react";
import TimeAgo from "timeago-react";
import LeadActivityBadge from "./LeadActivityBadge";
const LeadRelationShipInstalled = ({ activity }: any) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <li className="mb-10 ms-6">
      <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <img
          className="rounded-full shadow-lg"
          src={image}
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
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">
              {activity.data.payload.shop.myshopifyDomain}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <LeadActivityBadge type={activity.data.payload.type} />
          </div>
          <div className="text-sm text-gray-500">
            Updated by System • {formatDate(activity.data.payload.occurredAt)}
          </div>
        </div>
      </div>
    </li>
  );
};

export default LeadRelationShipInstalled;
