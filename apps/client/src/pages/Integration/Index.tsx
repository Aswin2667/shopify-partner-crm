import React from "react";
import download from "../../assets/download.svg";
import { integrations } from "./utils/data";
import IntegrationItem from "./components/IntegrationItem";
import { useQueryEvents } from "@/hooks/useQueryEvents";
import { useQuery } from "@tanstack/react-query";
import IntegrationService from "@/services/IntegrationService";
import { integrationAction } from "@/redux/integrationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TbArrowNarrowLeft } from "react-icons/tb";

const Integration: React.FC = () => {
  const dispatch = useDispatch();
  const { presentIntegrations, integrations } = useSelector(
    (state: any) => state.integration
  );

  const singularIntegrationTypes = new Set(
    integrations
      .filter((integration: any) => integration.isSingular)
      .map((integration: any) => integration.type)
  );

  const filteredPresentIntegrations = presentIntegrations.filter(
    (presentIntegration: any) =>
      !singularIntegrationTypes.has(presentIntegration.type)
  );

  useQueryEvents(
    useQuery({
      queryKey: ["getIntegrations"],
      queryFn: async () =>
        await IntegrationService.getPresentIntegrationsList(),
    }),
    {
      onSuccess: (data) =>
        dispatch(integrationAction.setPresentIntegrations(data)),
      onError: (error) => console.error(error),
    }
  );
  return (
    <div>
      <div className="mb-5">
        <div className="border-b p-5 w-full">
          <Link
            to=".."
            className="flex items-center gap-1 text-sm text-[#767676]
            hover:text-gray-800 w-fit"
          >
            <TbArrowNarrowLeft size={20} />
            <h6 className="">Integrations</h6>
          </Link>
          <h1 className="text-2xl font-medium">Create Integrations</h1>
        </div>
      </div>
      <div
        className="bg-gray-100 h-96 bg-no-repeat bg-cover bg-left-top flex justify-center"
        style={{ backgroundImage: `url(${download})` }}
      >
        <ul className="flex list-none items-center justify-center gap-8">
          {filteredPresentIntegrations.map((item: any, index: number) => (
            <IntegrationItem
              key={index}
              logo={item.logo}
              name={item.name}
              description={item.description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Integration;
