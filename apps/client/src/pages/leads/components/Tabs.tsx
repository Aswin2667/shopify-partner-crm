import {
  ActivityIcon,
  Mail,
  Phone,
  MessageCircle,
  AlarmClockCheck,
  Notebook,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Tabs = () => {
  const tabs = [
    { to: "", icon: ActivityIcon, label: "All Activity" },
    { to: "emails", icon: Mail, label: "Emails" },
    { to: "calls", icon: Phone, label: "Calls" },
    { to: "messages", icon: MessageCircle, label: "SMS" },
    { to: "tasks", icon: AlarmClockCheck, label: "Tasks" },
    { to: "notes", icon: Notebook, label: "Notes" },
  ];
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
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
