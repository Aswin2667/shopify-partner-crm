import { Settings } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import LeadStatusService from "@/services/LeadStatusService"
import { useEffect, useState } from "react"



export default function StatusList() {

 const [statuses,setStatuses] = useState([])
  const orgId = window.location.pathname.split("/")[1];

  useEffect(() => {
    const getAvailableLeadStatus = async () => {
      const response = await LeadStatusService.getAllByOrgId(orgId);
      setStatuses(response?.data.data);
        };
    getAvailableLeadStatus();
  }, []);

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <div className="space-y-2">
        {statuses.map((status:any) => (
          <div key={status.id} className="flex items-center space-x-2">
            <Checkbox id={status} />
            <label
              htmlFor={status.status}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {status.status}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-2 border-t">
        <Button variant="ghost" className="w-full justify-start px-2">
          <Settings className="mr-2 h-4 w-4" />
          Manage Statuses
        </Button>
      </div>
    </div>
  )
}