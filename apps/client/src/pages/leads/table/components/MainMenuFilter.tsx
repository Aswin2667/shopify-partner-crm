import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

const menuItems = [
  { icon: "📊", label: "Leads" },
  { icon: "👥", label: "Contacts" },
  { icon: "✉️", label: "Emails" },
  { icon: "📞", label: "Calls" },
  { icon: "✅", label: "Tasks" },
];

export default function MainMenuFilter({ onLeadClick, onContactClick }: any) {
  // Unified click handler
  const handleClick = (label: string) => {
    switch (label) {
      case "Leads":
        onLeadClick();
        break;
      case "Contacts":
        onContactClick();
        break;
      // Add more cases as needed for additional menu items
      default:
        console.warn(`No action defined for ${label}`);
    }
  };

  return (
    <div>
      <SheetHeader className="min-w-full flex items-center justify-center">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleClick(item.label)} // Use unified handler
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
