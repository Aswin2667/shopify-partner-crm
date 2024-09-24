import * as React from "react";
import { useEffect, useState } from "react";
import LeadService from "@/services/LeadService";
import { toast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";
import { useNavigate, useParams } from "react-router-dom";
import image from "../../../assets/shopify-logo.svg";
import { DataTableToolbar } from "./components/data-table-toolbar";
import LeadBadge from "../components/LeadBadge";
import { DataTablePagination } from "./components/data-table-pagination";
import TimeAgo from "timeago-react";
import { Label } from "@/components/ui/label";
import NoLead from "../../../assets/icons/NoLead.svg";
type Project = {
  id: string;
  name: string;
  type: string;
  data: {
    appId: string;
  };
  isSynced: boolean;
  createdAt: number;
  updatedAt: number;
};

type Lead = {
  id: string;
  shopifyDomain: string;
  shopifyStoreId: string;
  leadSource: string | null;
  shopDetails: string | null;
  industry: string | null;
  createdAt: number;
  status: string;
  updatedAt: string;
  deletedAt: string;
  integrationId: string;
  organizationId: string;
  projectCount: string;
  projects: Project[];
};

const LeadTable: React.FC = () => {
  const { organizationId } = useParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      if (organizationId) {
        try {
          const response: any = await LeadService.getByOrganizationId(
            organizationId as string
          );
          if (response.status) {
            setLeads(response.data.data);
            setTotalItems(response.data.data.length);
          } else {
            toast({
              title: response.message,
              description: DateHelper.formatTimestamp(
                DateHelper.getCurrentUnixTime()
              ),
              duration: 1000,
              variant: response.status ? "default" : "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching leads:", error);
        }
      }
    };

    fetchLeads();
  }, [organizationId]);

  // Handle search filtering
  const filteredLeads = leads.filter((lead) =>
    lead.shopifyDomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 h-screen flex flex-col overflow-auto">
      <div className="relative overflow-hidden h-screen flex-1 bg-white dark:bg-black sm:rounded-lg flex flex-col items-between">
        <div className="flex justify-between items-center p-4">
          <Label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for lead"
              required
            />
          </div>
          <DataTableToolbar leads={leads} />
        </div>
        <div className="overflow-auto mb-4 max-h-[700px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Lead
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Lead from
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Sales
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Revenue
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="min-h-[700px]">
                {currentLeads.length === 0 ? (
                  <tr className="min-h-[700px]">
                    <td colSpan={6} className="text-center py-4 h-[500px]">
                      <span className="flex justify-center">
                        <img src={NoLead} alt="" />
                      </span>
                      Try a different combination of filters, reset them, or...
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead:any) => {
                    return (
                      <tr
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={lead.id}
                      >
                        <th
                          scope="row"
                          onClick={() => navigate(`${lead.id}`)}
                          className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:underline cursor-pointer"
                        >
                          <img
                            src={image}
                            alt="shopify"
                            className="w-5 h-5 mr-3"
                          />
                          {lead.shopifyDomain}
                        </th>
                        <td className="px-4 py-2">
                          {lead.projects.length > 0 ? (
                            lead.projects.map((project: Project) => (
                              <span
                                key={project.id}
                                className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
                              >
                                {project.name}
                              </span>
                            ))
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                              Manually created lead
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <LeadBadge status={lead.leadstatus} />
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 mr-2 text-gray-400"
                              aria-hidden="true"
                            >
                              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.562a2.25 2.25 0 012.205-1.876h7.956a.75.75 0 00.723-.553l2.532-9.482h2.022a.75.75 0 000-1.5H2.25zM15.038 12H8.485L6.46 4.5h10.495l-1.917 7.173A3.745 3.745 0 0015.038 12z" />
                              <path
                                fillRule="evenodd"
                                d="M8.25 18a.75.75 0 011.5 0 2.25 2.25 0 004.5 0 .75.75 0 011.5 0 3.75 3.75 0 01-7.5 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            3.67K
                          </div>
                        </td>
                        <td className="px-4 py-2">$567.99</td>
                        <td className="px-4 py-2 text-center">
                          <TimeAgo
                            datetime={DateHelper.convertToDateString(
                              lead.createdAt
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <DataTablePagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLeads.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default LeadTable;
