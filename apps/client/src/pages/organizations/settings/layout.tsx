 import { SidebarNav } from "./components/sidebar-nav";
import { Outlet } from "react-router-dom";

export const metadata: any = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "profile",
  },
  {
    title: "Appearance",
    href: "appearance",
  },
  {
    title: "Notifications",
    href: "notifications",
  },
  {
    title: "Mail Templates",
    href: "templates",
  },
  {
    title: "Display",
    href: "display",
  },
  {
    title: "Integrations",
    href: "integration",
  },
  {
    title: "Custom Fields",
    href: "custom-fields",
  },
  {
    title: "Manage Access",
    href: "manage-access",
  },
  {
    title: "Custom Status",
    href: "status",
  },
  {
    title: "Email",
    href: "email",
  },
];

export default function SettingsLayout() {
  return (
    <>
      <div className="hidden space-y-6 md:block p-4">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full ">
          <aside className=" w-[200px]">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 p-4 max-h-[800px] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
