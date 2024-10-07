import { Control } from "react-hook-form";
import ShopifyInput from "./ShopifyInput";

export type ProjectInputType = "SHOPIFY";

type Props = {
  type: ProjectInputType;
  control: Control<any>;
};

const ProjectInput = ({ type, control }: Props) => {
  const Inputs = {
    SHOPIFY: <ShopifyInput control={control} />,
  };

  return Inputs[type] || null;
};

export default ProjectInput;
