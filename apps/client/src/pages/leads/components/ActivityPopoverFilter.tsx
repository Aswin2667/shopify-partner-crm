import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Activity } from "lucide-react";

export default function ActivityPopoverFilter() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-3 flex gap-2 items-center">
          <Activity className="h-3 w-3 " />
          All Activity
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-fit p-1">
        <Input placeholder="Search..." />
        <Separator />
        <br />
        <ScrollArea className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <Label className="flex h-8 w-full items-center gap-4 hover:bg-muted rounded-md  bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                <input type="checkbox" />
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>
                  {i === 0
                    ? "Call"
                    : i === 1
                      ? "Email"
                      : i === 2
                        ? "SMS"
                        : i === 3
                          ? "Task"
                          : i === 4
                            ? "Follow Up"
                            : i === 5
                              ? "Appointment"
                              : i === 6
                                ? "Quotation"
                                : i === 7
                                  ? "Invoice"
                                  : i === 8
                                    ? "Payment"
                                    : "Task"}
                </span>
              </Label>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
