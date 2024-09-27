import Clock from "@/pages/Clock";
import {
  ActivityIcon,
  Mail,
  Phone,
  MessageCircle,
  AlarmClockCheck,
  Notebook,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Tabs = () => {
  const tabs = [
    { to: "", icon: ActivityIcon, label: "My Settings" },
    // { to: "limit", icon: Mail, label: "Sending Limits" },
    { to: "from", icon: MessageCircle, label: "From Mail" },
    { to: "signature", icon: Notebook, label: "Signature" },
    { to: "unsubscribe", icon: Phone, label: "Unsubscribe Link" },
  ];
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <ul className="flex list-none flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs.map((tab, index) => {
          return (
            <li key={index} className="me-2">
              <NavLink
                end
                to={tab.to}
                className={({ isActive }) => {
                  return `inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                    isActive
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`;
                }}
              >
                <tab.icon className={`w-4 h-4 me-2 `} />
                {tab.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
