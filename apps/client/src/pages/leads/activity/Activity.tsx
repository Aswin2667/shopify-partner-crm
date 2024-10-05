import LeadService from "@/services/LeadService";
import { useEffect, useState } from "react";
import LeadCreated from "./components/LeadCreated";
import LeadNoteCreated from "./components/LeadNoteCreated";
import LeadRelationShipInstalled from "./components/LeadRelationShipInstalled";
import LeadRelationShipUnInstalled from "./components/LeadRelationShipUnInstalled";
import LeadStatusUpdated from "./components/LeadStatusUpdated";
import LeadSubscriptionChargeActivated from "./components/LeadSubscriptionChargeActivated";
const Activity = () => {
  const [data, setData] = useState([]);
  const leadId = window.location.pathname.split("/")[3];
  console.log(leadId);
  useEffect(() => {
    const fetchData = async () => {
      const response = await LeadService.getActivityById(leadId);
      console.log(response.data);
      setData(response.data.data);
    };

    fetchData();
  }, []);

  return (
    <ol className="relative border-s list-none w-full border-gray-200 dark:border-gray-700">
      {data.map((activity: any) => {
        if (activity.type === "LEAD_CREATED") {
          return <LeadCreated activity={activity} />;
        } else if (activity.type === "NOTE_CREATED") {
          return <LeadNoteCreated activity={activity} />;
        } else if (activity.type === "RELATIONSHIP_INSTALLED") {
          return <LeadRelationShipInstalled activity={activity} />;
        } else if (activity.type === "RELATIONSHIP_UNINSTALLED") {
          return <LeadRelationShipUnInstalled activity={activity} />;
        } else if (activity.type === "STATUS_CHANGE") {
          return <LeadStatusUpdated activity={activity} />;
        } else if (activity.type === "SUBSCRIPTION_CHARGE_ACTIVATED") {
          return <LeadSubscriptionChargeActivated activity={activity} />;
        }
      })}
    </ol>
  );
};

export default Activity;

// function leadSubscriptionChargeActivated(activity: any): any {
//   const [isExpanded, setIsExpanded] = useState(false)

//   const payload = {
//     "shop": {
//       "id": "gid://partners/Shop/71979237683",
//       "myshopifyDomain": "sakthivel10.myshopify.com"
//     },
//     "type": "SUBSCRIPTION_CHARGE_ACTIVATED",
//     "charge": {
//       "id": "gid://shopify/AppSubscription/31146836275",
//       "name": "Basic",
//       "test": true,
//       "amount": {
//         "amount": "9.0",
//         "currencyCode": "USD"
//       },
//       "billingOn": "2023-10-23"
//     },
//     "occurredAt": "2023-10-09T13:04:18.000000Z"
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div
//         className="cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50 rounded-lg p-2"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center space-x-4">
//           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//             <img src="/placeholder.svg?height=40&width=40" alt="Shop avatar" className="rounded-full" />
//           </div>
//           <div className="flex-grow">
//             <div className="flex items-center space-x-2">
//               <span className="font-semibold">{payload.shop.myshopifyDomain}</span>
//               <ArrowRight className="w-4 h-4 text-gray-400" />
//               <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
//                 {payload.type.split('_').join(' ')}
//               </span>
//             </div>
//             <div className="text-sm text-gray-500">
//               Updated by System • {formatDate(payload.occurredAt)}
//             </div>
//           </div>
//           <div className="flex-shrink-0 transition-transform duration-200 ease-in-out" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
//             <ChevronDown className="w-5 h-5 text-gray-500" />
//           </div>
//         </div>
//       </div>
//       <div className={`mt-4 pl-14 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
//         <div className="bg-gray-100 p-4 rounded-lg">
//           <h3 className="font-semibold mb-2">Subscription Details:</h3>
//           <ul className="space-y-1 text-sm">
//             <li><span className="font-medium">Plan:</span> {payload.charge.name}</li>
//             <li><span className="font-medium">Amount:</span> {payload.charge.amount.amount} {payload.charge.amount.currencyCode}</li>
//             <li><span className="font-medium">Billing Date:</span> {formatDate(payload.charge.billingOn)}</li>
//             <li><span className="font-medium">Charge ID:</span> {payload.charge.id.split('/').pop()}</li>
//             {payload.charge.test && (
//               <li className="text-yellow-600 font-semibold">Test Mode</li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }
// function leadCreated(activity: any): any {
//   const { user } = activity;
//   return (
//     <li className="mb-10 ms-6">
//       <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
//         <img
//           className="rounded-full shadow-lg"
//           src={user.avatarUrl || ""}
//           alt="Bonnie image"
//           referrerPolicy="no-referrer"
//         />
//       </span>
//       <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
//         <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
//           <TimeAgo
//             datetime={DateHelper.convertToDateString(activity.createdAt)}
//           />
//         </time>
//         <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
//           {activity.data.message + " "}
//           <ProfileHoverCard user={user} />
//         </div>
//       </div>
//     </li>
//   );
// }

// function leadNoteCreated(activity: any): any {
//   const { user } = activity;
//   return (
//     <li className="mb-10 ms-6">
//       <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
//         <img
//           className="rounded-full shadow-lg"
//           src={user.avatarUrl || ""}
//           alt="Bonnie image"
//           referrerPolicy="no-referrer"
//         />
//       </span>
//       <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
//         <div className="items-center justify-between mb-3 sm:flex">
//           <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
//             <TimeAgo
//               datetime={DateHelper.convertToDateString(activity.createdAt)}
//             />
//           </time>
//           <div className="text-sm font-normal text-gray-500 lex dark:text-gray-300">
//             <ProfileHoverCard user={user} />
//             added a note
//           </div>
//         </div>
//         <div
//           dangerouslySetInnerHTML={{ __html: activity.data.data }}
//           className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
//         ></div>
//       </div>
//     </li>
//   );
// }

// function leadRelationShipInstalled(activity: any): any {
//    return (
//     <li className="mb-10 ms-6">
//       <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
//         <img
//           className="rounded-full shadow-lg"
//           src={image}
//           alt="Bonnie image"
//           referrerPolicy="no-referrer"
//         />
//       </span>
//       <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
//         <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
//           <TimeAgo
//             datetime={DateHelper.convertToDateString(activity.createdAt)}
//           />
//         </time>
//         <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
//           {activity.data.message + " "}
//           {/* <ProfileHoverCard user={user} /> */}
//         </div>
//       </div>
//     </li>
//   );
// }

// function leadRelationShipUnInstalled(activity: any): any {
//   return (
//     <li className="mb-10 ms-6">
//       <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
//         <img
//           className="rounded-full shadow-lg"
//           src={image}
//           alt="Bonnie image"
//           referrerPolicy="no-referrer"
//         />
//       </span>
//       <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
//         <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
//           <TimeAgo
//             datetime={DateHelper.convertToDateString(activity.createdAt)}
//           />
//         </time>
//         <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
//           {activity.data.message + " "}
//           {/* <ProfileHoverCard user={user} /> */}
//         </div>
//       </div>
//     </li>
//   );
// }
// function leadStatusUpdated(activity: any) {

// }
