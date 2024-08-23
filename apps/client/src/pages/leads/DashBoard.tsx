import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  File,
  Link,
  Merge,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Outlet } from "react-router-dom";
import Tabs from "./components/Tabs";
import { toast } from "sonner";
import ExpandableContactCard from "./components/ExpandableContactCard";
import OpurtunityExpandableCard from "./components/OpurtunityExpandableCard";
import TaskExpandableCard from "./components/TaskExpandableCard";

export default function LeadDashboard() {


const leadId = window.location.pathname.split("/")[4];
console.log(leadId);
  return (
    <div className="flex flex-col min-h-full sm:gap-4 sm:py-4 sm:pl-4 overflow-scroll">
      <main className="flex flex-1 items-start gap-4 p-4 sm:px-6 h-screen overflow-scroll sm:py-0 md:gap-8">
        <div className="w-1/4 h-screen overflow-scroll" >
          <Card className="border-0 ">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Pasta.myshopify.com
                  <Button size="icon" variant="outline" className="h-6 w-6 ">
                    <Copy
                      className="h-3 w-3"
                      onClick={() => {
                        toast("Shop Domin URL copied to clipboard", {
                          duration: 800,
                        });
                      }}
                    />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <Select defaultValue="potential">
                  <SelectTrigger className="max-w-fit pt-0 pb-0 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="Bad_Fit">Bad Fit</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5 rotate-90" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-12">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Merge className="rotate-90 h-4 w-4" />
                      Merge
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Visibility Summary
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <File className="h-4 w-4" /> View Files
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className=" flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated <time dateTime="2023-11-23">November 23, 2023</time>
              </div>
            </CardFooter>
          </Card>
          <Separator className="my-4" />
          <ExpandableContactCard />
          <br />
          <TaskExpandableCard />
          <Separator className="my-4" />
          <OpurtunityExpandableCard />
        </div>
        <Separator orientation="vertical" />
        <div className="w-3/4">
          <Tabs />
          <div className="h-screen overflow-scroll p-5">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}