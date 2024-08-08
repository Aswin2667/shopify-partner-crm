import React, { useEffect, useState } from "react";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import close from "../../../assets/closeio.png";
import { HiOutlineExternalLink } from "react-icons/hi";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { integrationsList } from "../utils/data";

type Props = {};

const IntegrationDetailScreen: React.FC<Props> = (props: Props) => {
  const { intergrationName } = useParams();
  const [integration, setIntegration] = useState<any>({});

  useEffect(() => {
    setIntegration(
      integrationsList[intergrationName as keyof typeof integrationsList]
    );

    return () => {
      setIntegration({});
    };
  }, []);

  return (
    <div className="space-y-10 flex flex-col items-center">
      <div className="border-b p-5 w-full">
        <Link
          to=".."
          className="flex items-center gap-1 text-sm text-[#767676]
          hover:text-gray-800 w-fit"
        >
          <TbArrowNarrowLeft size={20} />
          <h6 className="">Integrations</h6>
        </Link>
        <h1 className="text-2xl font-medium">
          {intergrationName
            ? intergrationName?.charAt(0).toUpperCase() +
              intergrationName?.slice(1)
            : ""}
        </h1>
      </div>
      <div className="w-[40%] space-y-5">
        <div className="flex justify-between items-center">
          <IntegrationCard />
          <RiArrowLeftRightFill className="scale-[2] text-[#B2B2B2]" />
          <IntegrationCard logo={integration?.image} title={integration?.title}/>
        </div>
        <p className="text-sm">{integration?.description}</p>
        <hr />
        <button
          className="bg-[#2b62f0] text-white text-sm rounded-full ml-auto 
        px-3 py-1 font-semibold hover:bg-[#3062e0] flex items-center gap-2"
        >
          <span>Connect</span>
          <HiOutlineExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default IntegrationDetailScreen;

const IntegrationCard = ({ logo = close, title = "Close" }) => {
  return (
    <div className="border w-60 rounded-lg">
      <div className="flex justify-center items-center bg-[#F9F9F9] rounded-t-lg p-7">
        <img src={logo} alt="" className="h-[72px] object-contain" />
      </div>
      <h5 className="bg-white p-4 text-sm font-semibold rounded-b-lg">
        {title}
      </h5>
    </div>
  );
};
