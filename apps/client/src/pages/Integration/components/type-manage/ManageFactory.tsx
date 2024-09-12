import React from "react";
import Ecommerce from "./Ecommerce/Index";
import MailService from "./MailService/Index";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {};

const IntegrationCategory: Record<string, JSX.Element> = {
  ECOMMERCE: <Ecommerce />,
  MAIL_SERVICE: <MailService />,
};

const ManageFactory = (props: Props) => {
  const { integrationType } = useParams();
  const selectedIntegration = useSelector(
    (state: any) => state.integration.presentIntegrations
  ).find((integration: any) => integration.type === integrationType);

  console.log(selectedIntegration);
  return (
    <>
      {selectedIntegration && IntegrationCategory[selectedIntegration.category]}
    </>
  );
};

export default ManageFactory;
