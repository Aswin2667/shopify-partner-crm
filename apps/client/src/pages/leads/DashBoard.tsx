import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Mail,
  MoreVertical,
  Search,
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
import Activity from "./components/Activity";
import ActivityPopoverFilter from "./components/ActivityPopoverFilter";
import { Input } from "@/components/ui/input";
import DateRangePicker from "./components/date-range-picker";
import EmailEditor from "./components/EmailEditor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "./components/EmailEditor";

export default function LeadDashboard() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4">
      <main className="flex flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="w-1/4">
          <Card className="border-0">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Pasta.myshopify.com
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <Select >
                  <SelectTrigger className="max-w-fit  pt-0 pb-0 border-none">
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem defaultChecked value="potential">Potential</SelectItem>
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
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Glimmer Lamps x <span>2</span>
                    </span>
                    <span>$250.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Aqua Filters x <span>1</span>
                    </span>
                    <span>$49.00</span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$299.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$25.00</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>$329.00</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Liam Johnson</span>
                    <span>1234 Main St.</span>
                    <span>Anytown, CA 12345</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">
                    Same as shipping address
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>Liam Johnson</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>{/* <a to="mailto:">liam@acme.com</a> */}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>{/* <a to="tel:">+1 234 567 890</a> */}</dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated <time dateTime="2023-11-23">November 23, 2023</time>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
        <Separator orientation="vertical" />
        <div className="w-3/4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ActivityPopoverFilter />
              <Button variant="outline" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                Add Note
              </Button>
              <Button variant="outline" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <DateRangePicker />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </div>
          <Separator className="mb-5 mt-2" />
          <div className="h-screen overflow-scroll p-5">
            <Editor />
            <Activity />
          </div>
        </div>
      </main>
    </div>
  );
}
