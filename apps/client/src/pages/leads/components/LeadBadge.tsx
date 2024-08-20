// Mapping enum values to badge styles
const badgeStyles: any = {
  POTENTIAL:
    "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300",
  CUSTOMER:
    "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300",
  INTERESTED:
    "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300",
  NOT_INTERESTED:
    "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300",
  BAD_FIT:
    "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300",
  QUALIFIED:
    "bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300",
  CANCELED:
    "bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300",
};

export default function LeadBadge({ status }: any) {
  const badgeClass =
    badgeStyles[status] || "bg-gray-100 text-gray-800 border border-gray-500";
  return (
    <span
      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 ${badgeClass}`}
    >
      {status}
    </span>
  );
}
