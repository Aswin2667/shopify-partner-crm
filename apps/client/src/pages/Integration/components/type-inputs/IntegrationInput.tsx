import { Control } from "react-hook-form";
import ShopifyInput from "./ShopifyInput";
import MailGunInput from "./MailGunInput";
import SendGridInput from "./SendGridInput";

export type IntegrationInputType = "SHOPIFY" | "MAILGUN" | "SENDGRID";

type Props = {
  type: IntegrationInputType;
  control: Control<any, any>;
};

const IntegrationInput = ({ type, control }: Props) => {
  // const { control } = useFormContext();

  const Inputs = {
    SHOPIFY: <ShopifyInput control={control} />,
    MAILGUN: <MailGunInput control={control} />,
    SENDGRID: <SendGridInput control={control} />,
  };

  // @ts-ignore
  return Inputs[type];
};

export default IntegrationInput;
