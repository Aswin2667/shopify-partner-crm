import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";
import StatusCreateModal from "./StatusCreateModal";
import LeadStatusService from "@/services/LeadStatusService";
import { useSelector } from "react-redux";
import DateHelper from "@/utils/DateHelper";


const LeadStatus = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const { currentOrganization } = useSelector(
  (state: any) => state.organization
)
  useEffect(() => {
    const fetchLeadStatus = async () => {
      try {
        const response = await LeadStatusService.getAllByOrgId(currentOrganization?.id)
        console.log(response?.data)
        setStatus(response?.data.data);
      } catch (err:any) {
        setError(err.message || "Something went wrong.");
       } finally {
        setLoading(false);
      }
    };

    fetchLeadStatus();
  }, []);
  if (error) {
    return <div>Error: {error}</div>; // Display the error message
  }

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <StatusCreateModal />
      </div>
      <table className="w-fit max-h-[600px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
            <th scope="col" className="px-6 py-3 text-center">Actions</th>
           </tr>
        </thead>
        <tbody>
          {status.length > 0 ? (
            status.map((item:any) => (
              <tr
                key={item.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.status}
                </th>
                 <td className="px-6 py-4">{DateHelper.formatTimestamp(item.createdAt)}</td>
                 <td className="px-6 py-4 flex items-center justify-center gap-5">
                  <Pen className="h-4 w-4 cursor-pointer text-green-600 " />
                  <Trash className="h-4 w-4 cursor-pointer text-red-700" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center">
                No statuses available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadStatus;
