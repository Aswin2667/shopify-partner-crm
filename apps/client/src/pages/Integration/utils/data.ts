import { IntegrationItem } from "./types";
import gmail from "../../../assets/gmail.png";
import shopify from "../../../assets/shopify-logo.svg";

export const integrations: IntegrationItem[] = [
  {
    image: gmail,
    title: "Gmail",
    description: "Email integration with Gmail",
  },
  {
    image: shopify,
    title: "Shopify",
    description: "Shopify integration",
  },
];

export const integrationsList = {
  gmail: {
    image: gmail,
    title: "Gmail",
    description:
      "Close seamlessly integrates with Gmail, so you can have full visibility into your email comms from within the app. When you sync your Gmail account to Close, you'll get an email platform supercharged for sales.",
  },
  shopify: {
    image: shopify,
    title: "Shopify",
    description:
      "Shopify seamlessly integrates with your e-commerce operations, giving you full visibility into your sales and customer data from within the app. When you connect Shopify to your platform, you'll gain a robust, all-in-one solution tailored to optimize and supercharge your online business.",
  },
};
