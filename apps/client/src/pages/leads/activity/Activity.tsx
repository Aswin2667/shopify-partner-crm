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
