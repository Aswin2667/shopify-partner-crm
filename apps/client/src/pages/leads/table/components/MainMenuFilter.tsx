import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'

const menuItems = [
  { icon: '📊', label: 'Leads' },
  { icon: '👥', label: 'Contacts' },
  { icon: '💼', label: 'Opportunities' },
  { icon: '📍', label: 'Addresses' },
  { icon: '✉️', label: 'Emails' },
  { icon: '📞', label: 'Calls' },
  { icon: '📅', label: 'Meetings' },
  { icon: '💬', label: 'SMS' },
  { icon: '🗨️', label: 'Communication' },
  { icon: '📝', label: 'Notes' },
  { icon: '✅', label: 'Tasks' },
  { icon: '🔄', label: 'Workflows' },
  { icon: '📥', label: 'Imports' },
  { icon: '🔧', label: 'Custom Activities' },
  { icon: '🏷️', label: 'Custom Objects' },
]

export default function MainMenuFilter({ onLeadClick }:any) {
  return (
    <div className="">
        <SheetHeader className="min-w-full flex items-center justify-center">
          <SheetTitle>Leads</SheetTitle>
        </SheetHeader>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={item.label === 'Leads' ? onLeadClick : undefined}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}