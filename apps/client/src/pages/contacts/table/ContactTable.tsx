import * as React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ContactService from "@/services/ContactService";
import { toast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";
import { useNavigate } from "react-router-dom";
import imge from '../../../assets/shopify-logo.svg';
import TablePagination from "./components/data-table-pagination";
import { DataTableToolbar } from "./components/data-table-toolbar";

export default function ContactTable() {
  const [contacts, setContacts] = React.useState([]);
  const { currentIntegration } = useSelector((state: any) => state.integration);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentIntegration?.id) {
        try {
          const response: any = await ContactService.getByIntegrationId(currentIntegration.id);
          if (response.status) {
            setContacts(response.data);
          } else {
            toast({
              title: response.message,
              description: DateHelper.formatTimestamp(DateHelper.getCurrentUnixTime()),
              duration: 1000,
              variant: `${response.status ? "default" : "destructive"}`,
            });
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
          toast({
            title: "Error",
            description: "An error occurred while fetching contacts.",
            duration: 1000,
            variant: "destructive",
          });
        }
      }
    };

    fetchContacts();
  }, [currentIntegration]);

  return (
    <div className="p-5">
      <div className="relative overflow-scroll h-screen bg-white dark:bg-black sm:rounded-lg">
        {/* <DataTableToolbar leads={contacts} /> */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Lead
                </th>
                <th scope="col" className="px-4 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-4 py-3">
                  Last Contacted
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: any) => {
                return (
                  <tr key={contact.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${contact.id}`}
                          type="checkbox"
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={`checkbox-${contact.id}`} className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {contact.primaryEmail || 'N/A'}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {/* {contact.lead.shopifyDomain || 'N/A'} */}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {contact.primaryPhNo || 'N/A'}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {contact.lastContacted ? DateHelper.formatTimestamp(Number(contact.lastContacted)) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                      {DateHelper.formatTimestamp(Number(contact.createdAt))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <nav
          className="flex flex-col w-full items-start justify-center p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
          aria-label="Table navigation"
        >
          <TablePagination />
        </nav>
      </div>
    </div>
  );
}
