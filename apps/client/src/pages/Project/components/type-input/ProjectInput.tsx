import React from "react";
import ShopifyInput from "./ShopifyInput";

export type ProjectInputType = "SHOPIFY";

type Props = {
  type: ProjectInputType;
  dispatch: React.Dispatch<any>;
};

const ProjectInput = ({ type, dispatch }: Props) => {
  const Inputs = {
    SHOPIFY: <ShopifyInput dispatch={dispatch} />,
  };
  return Inputs[type];
};

export default ProjectInput;
