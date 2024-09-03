import React from "react";
import { IntegrationItem as IntegrationItemProps } from "../utils/types";
import { Link } from "react-router-dom";

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  logo,
  name,
  description,
}: IntegrationItemProps) => {
  return (
    <li
      className="border w-40 h-52 bg-white rounded-lg cursor-pointer hover:-translate-y-[2px]
    hover:drop-shadow-lg hover:transition-all hover:duration-200"
    >
      <Link to={name.toLowerCase()}>
        <div className="h-[55%] flex justify-center items-center">
          <img src={logo} alt="" className="h-16 object-contain" />
        </div>
        <div className="h-[45%] p-3 text-sm space-y-1">
          <h6 className="font-semibold">{name}</h6>
          <h6 className="text-gray-700">{description}</h6>
        </div>
      </Link>
    </li>
  );
};

export default IntegrationItem;
