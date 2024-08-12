import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import { Outlet } from "react-router-dom"

export const metadata: any = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

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
    title: "Display",
    href: "display",
  },
]

export default function SettingsLayout() {
  return (
    <>
      <div className="hidden space-y-6 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full ">
          <aside className="lg:w-1/5 max-h-fit">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 p-4 max-h-[800px] overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}