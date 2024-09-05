import { Mail, Trash2 } from "lucide-react";
import React from "react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import GmailIcon from "../../../assets/gmail.png";
import DateHelper from "@/utils/DateHelper";
import { PiCheckCircleDuotone } from "react-icons/pi";
import { useMutation } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

const ManageIntegration = (props: Props) => {
  const { integrationType } = useParams();
  const { toast } = useToast();

  const { integrations, presentIntegrations } = useSelector(
    (state: any) => state.integration
  );

  const selectedIntegration = presentIntegrations.find(
    (integration: any) => integration.type === integrationType
  );

  const integration = selectedIntegration.singular
    ? integrations.find(
        (integration: any) => integration.type === integrationType
      )
    : integrations.filter(
        (integration: any) => integration.type === integrationType
      );

  const { mutate: deleteIntegration } = useMutation({
    mutationFn: async (id) => await IntegrationService.delete(id),
    onSuccess: (response) => {
      console.log(response);
      toast({
        title: response.message,
        duration: 1000,
        variant: `${response.status ? "default" : "destructive"}`,
      });
    },
    onError: (error: any) => {
      console.error("Creation failed:", error?.response.data);
    },
  });

  console.log(integration);

  return (
    <div className="space-y-10">
      {/* BreadCrumbs */}
      <div className="border-b p-5 w-full">
        <Link
          to=".."
          className="flex items-center gap-1 text-sm text-[#767676]
          hover:text-gray-800 w-fit"
        >
          <TbArrowNarrowLeft size={20} />
          <h6 className="">Integration</h6>
        </Link>
        <h1 className="text-2xl font-medium">
          {integrationType
            ? integrationType?.charAt(0).toUpperCase() +
              integrationType?.slice(1)
            : ""}
        </h1>
      </div>
      <div className="space-y-4">
        <h1 className="uppercase">Connected {integrationType} Accounts</h1>
        <div>
          {!selectedIntegration.singular && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-center">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Actions
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {integration.length > 0 &&
                    integration.map((integration: any) => {
                      return (
                        <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ">
                          <th
                            scope="row"
                            className="flex hover:underline hover:text-blue-600 hover:dark:text-blue-600 hover:cursor-pointer items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white justify-center"
                          >
                            <img
                              src={GmailIcon}
                              alt="asd"
                              className="w-5 h-5 mr-3"
                            />
                            {integration.data.email}
                          </th>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <PiCheckCircleDuotone
                                size={24}
                                className="text-green-500"
                              />
                              <span>Connected</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <button
                              className="flex items-center mx-auto"
                              onClick={() => deleteIntegration(integration?.id)}
                            >
                              <Trash2 className="" />
                            </button>
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">
                            {DateHelper.formatTimestamp(integration.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ManageIntegration;
