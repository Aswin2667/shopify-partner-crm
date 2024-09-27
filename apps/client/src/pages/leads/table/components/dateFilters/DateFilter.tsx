import { useState } from "react";
import Select from "react-select";
import { DatePicker } from "./DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const getDateFromValue = (value: string) => {
  const now = dayjs();

  switch (value) {
    case "now":
      return now.toDate();
    case "today":
      return now.startOf("day").toDate();
    case "tomorrow":
      return now.add(1, "day").startOf("day").toDate();
    case "this_week":
      return now.startOf("week").toDate();
    case "this_month":
      return now.startOf("month").toDate();
    case "this_quarter":
      return now.startOf("quarter" as any).toDate();
    case "this_year":
      return now.startOf("year").toDate();
    case "yesterday":
      return now.subtract(1, "day").startOf("day").toDate();
    case "last_week":
      return now.subtract(1, "week").startOf("week").toDate();
    case "last_month":
      return now.subtract(1, "month").startOf("month").toDate();
    case "last_quarter":
      return now
        .subtract(1, "quarter" as any)
        .startOf("quarter" as any)
        .toDate();
    case "last_year":
      return now.subtract(1, "year").startOf("year").toDate();
    case "next_week":
      return now.add(1, "week").startOf("week").toDate();
    case "next_month":
      return now.add(1, "month").startOf("month").toDate();
    case "next_quarter":
      return now
        .add(1, "quarter" as any)
        .startOf("quarter" as any)
        .toDate();
    case "next_year":
      return now.add(1, "year").startOf("year").toDate();
    case "custom_date":
      return null;
    default:
      return null;
  }
};

const getUTCInSeconds = (date: string) => {
  return date ? Math.floor(dayjs(date).utc().unix()) : null;
};

const comparisonOptions = [
  { value: "is", label: "is" },
  { value: "is-not", label: "is not" },
  { value: "is-before", label: "is before" },
  { value: "is-on-or-before", label: "is on or before" },
  { value: "is-on-or-after", label: "is on or after" },
  { value: "is-after", label: "is after" },
  { value: "is-between", label: "is between" },
];

const dateOptions = [
  { label: "Now", value: "now" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "This quarter", value: "this_quarter" },
  { label: "This year", value: "this_year" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last week", value: "last_week" },
  { label: "Last month", value: "last_month" },
  { label: "Last quarter", value: "last_quarter" },
  { label: "Last year", value: "last_year" },
  { label: "Next week", value: "next_week" },
  { label: "Next month", value: "next_month" },
  { label: "Next quarter", value: "next_quarter" },
  { label: "Next year", value: "next_year" },
  { label: "Custom date...", value: "custom_date" },
];

const generateSQLQuery = (comparison: string, date: Date | null) => {
  const column = "createdAt"; // Change to the appropriate field (e.g., `updatedAt`)
  if (!date) return "";

  const dateFormatted = dayjs(date).utc().format("YYYY-MM-DDTHH:mm:ssZ");

  switch (comparison) {
    case "is":
      return `SELECT * FROM "Lead" WHERE "${column}" = '${getUTCInSeconds(dateFormatted)}';`;
    case "is-not":
      return `SELECT * FROM "Lead" WHERE "${column}" != '${getUTCInSeconds(dateFormatted)}';`;
    case "is-before":
      return `SELECT * FROM "Lead" WHERE "${column}" < '${getUTCInSeconds(dateFormatted)}';`;
    case "is-on-or-before":
      return `SELECT * FROM "Lead" WHERE "${column}" <= '${getUTCInSeconds(dateFormatted)}';`;
    case "is-on-or-after":
      return `SELECT * FROM "Lead" WHERE "${column}" >= '${getUTCInSeconds(dateFormatted)}';`;
    case "is-after":
      return `SELECT * FROM "Lead" WHERE "${column}" > '${getUTCInSeconds(dateFormatted)}';`;
    case "is-between":
      // This requires two dates; additional logic can be added for custom ranges.
      return "";
    default:
      return "";
  }
};

const DatePickerSelect = ({selectedComparison,setSelectedComparison,selectedDateOption,setSelectedDateOption,customDate,setCustomDate}:any) => {

  const [query, setQuery] = useState<string>("");

  const handleComparisonChange = (option: any) => {
    setSelectedComparison(option);
  };

  const handleDateOptionChange = (option: any) => {
    setSelectedDateOption(option);
    const date = getDateFromValue(option.value);

    if (option.value !== "custom_date") {
      setCustomDate(null);
      const sqlQuery = generateSQLQuery(selectedComparison.value, date);
      setQuery(sqlQuery);
      console.log("SQL Query:", sqlQuery);
    } else {
      setQuery("");
    }
  };

  const handleCustomDateChange = (date: Date | null) => {
    setCustomDate(date);
    const sqlQuery = generateSQLQuery(selectedComparison?.value, date);
    setQuery(sqlQuery);
    console.log("SQL Query:", sqlQuery);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        options={comparisonOptions}
        value={selectedComparison}
        onChange={handleComparisonChange}
        placeholder="Select comparison..."
        className="mb-2"
      />

      <Select
        options={dateOptions}
        value={selectedDateOption}
        onChange={handleDateOptionChange}
        placeholder="Select date filter..."
        className="mb-2"
      />

      {selectedDateOption?.value === "custom_date" && (
        <div className="mt-2">
          <DatePicker date={customDate} setDate={handleCustomDateChange} />
        </div>
      )}

      <div>
        <p>Generated SQL Query:</p>
        <code>{query ? query : "No valid query"}</code>
        {}
      </div>
    </div>
  );
};

export default DatePickerSelect;
