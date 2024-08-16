import React from "react";
import download from "../../assets/download.svg";
import { integrations } from "./utils/data";
import IntegrationItem from "./components/IntegrationItem";

const Integration: React.FC = () => {
  return (
    <div>
      <div className="border-b p-5">
        <h1 className="text-2xl font-medium">Create Integrations</h1>
      </div>
      <div
        className="bg-gray-100 h-96 bg-no-repeat bg-cover bg-left-top flex justify-center"
        style={{ backgroundImage: `url(${download})` }}
      >
        <ul className="flex items-center justify-center gap-8">
          {integrations.map(({ image, title, description }) => (
            <IntegrationItem
              key={title}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Integration;
