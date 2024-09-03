import React from "react";
import ShopifyInput from "./ShopifyInput";

export type IntegrationInputType = "SHOPIFY" | "MAIL_GUN" | "SEND_GRID";

type Props = {
  type: IntegrationInputType;
  dispatch: React.Dispatch<any>;
};

const IntegrationInput = ({ type, dispatch }: Props) => {
  const Inputs = {
    SHOPIFY: <ShopifyInput dispatch={dispatch} />,
    MAIL_GUN: <>MAIL_GUN</>,
    SEND_GRID: <>SEND_GRID</>,
  };
  return Inputs[type];
};

export default IntegrationInput;
