import { SidebarNav } from '@/pages/organizations/settings/components/sidebar-nav'
import React from 'react'
import CliAccesTokens from './CliAccessTokens'
import { Outlet } from 'react-router-dom'

const ProjectSettings = () => {
    const sidebarNavItems:any[] = [
        {
            title: "Access Tokens",
            href: "tokens",
          },
          {
            title: "Custom Webhooks",
            href: "webhooks",
          },
    ]
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
  )
}

export default ProjectSettings