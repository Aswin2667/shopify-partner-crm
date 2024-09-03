import React from "react";
import ShopifyInput from "./ShopifyInput";
import MailGunInput from "./MailGunInput";
import SendGridInput from "./SendGridInput";

export type IntegrationInputType = "SHOPIFY" | "MAILGUN" | "SENDGRID";

type Props = {
  type: IntegrationInputType;
  dispatch: React.Dispatch<any>;
};

const IntegrationInput = ({ type, dispatch }: Props) => {
  const Inputs = {
    SHOPIFY: <ShopifyInput dispatch={dispatch} />,
    MAILGUN: <MailGunInput dispatch={dispatch} />,
    SENDGRID: <SendGridInput dispatch={dispatch} />,
  };
  return Inputs[type];
};

export default IntegrationInput;
