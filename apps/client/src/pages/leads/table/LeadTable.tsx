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
            console.log(response.data.data);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 h-screen flex flex-col overflow-auto">
      {/* TODO:  overflow-hidden -> overflow-scroll */}
      <div className="relative overflow-hidden h-screen flex-1 bg-white dark:bg-black sm:rounded-lg flex flex-col items-between">
        <DataTableToolbar leads={leads} />
        <div className="overflow-auto mb-4 max-h-[700px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  {/* <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        aria-label="Select all"
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        Select all
                      </label>
                    </div>
                  </th> */}
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
              <tbody>
                {currentLeads.map((lead) => {
                  return (
                    <tr
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      key={lead.id}
                    >
                      {/* <td className="w-4 px-4 py-3">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-table-${lead.id}`}
                            type="checkbox"
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            aria-label={`Select lead ${lead.id}`}
                          />
                          <label
                            htmlFor={`checkbox-table-${lead.id}`}
                            className="sr-only"
                          >
                            Select lead {lead.id}
                          </label>
                        </div>
                      </td> */}
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
                              key={project.id} // Ensure to use a unique key when rendering lists
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
                        <LeadBadge status={lead.status} />
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
                            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                          </svg>
                          1.6M
                        </div>
                      </td>
                      <td className="px-4 py-2">$3.2M</td>
                      <td className="px-4 py-2 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                        <TimeAgo
                          datetime={DateHelper.convertToDateString(
                            lead.createdAt
                          )}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <DataTablePagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default LeadTable;
