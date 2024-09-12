import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

const Index = (props: Props) => {
  const { integrationType } = useParams();
  console.log(integrationType);
  return <div>Ecommerce</div>;
};

export default Index;
