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
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
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
import Editor from "./components/EmailEditor";
import Compose from "../mail/components/Compose";
import { Outlet, useParams } from "react-router-dom";
import Tabs from "./components/Tabs";
import { toast } from "sonner";
import ExpandableContactCard from "./components/ExpandableContactCard";
import { useEffect, useState } from "react";
import LeadService from "@/services/LeadService";
import DateHelper from "@/utils/DateHelper";

export default function LeadDashboard() {
  const [lead, setLead] = useState<any>({});
  const { leadId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const response = await LeadService.getLeadById(leadId as string);
      setLead(response.data.data);
      console.log(response.data.data);
    };
    fetchData();
  }, [leadId]);
  return (
    <div className="flex flex-col min-h-full sm:gap-4 sm:py-4 sm:pl-4 overflow-scroll">
      <main className="flex flex-1 items-start gap-4 p-4 sm:px-6 h-screen overflow-scroll sm:py-0 md:gap-8">
        <div className="w-1/4 h-screen overflow-scroll">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row pb-0 items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg pb-0">
                  <a
                    className="cursor-pointer  text-gray-900 dark:text-white hover:underline hover:text-blue-600 hover:dark:text-blue-600"
                    href={"https://" + lead.shopifyDomain}
                    target="_blank"
                  >
                    {lead.shopifyDomain}
                  </a>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy
                      className="h-3 w-3"
                      onClick={() => {
                        const storeDomainURL = "https://" + lead.shopifyDomain;
                        navigator.clipboard
                          .writeText(storeDomainURL)
                          .then(() => {
                            toast("Shop Domain URL copied to clipboard", {
                              duration: 800,
                            });
                          })
                          .catch((error) => {
                            toast("Failed to copy!", {
                              duration: 800,
                            });
                            console.error(
                              "Error copying to clipboard: ",
                              error
                            );
                          });
                      }}
                    />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <Select value={lead.status}>
                  <SelectTrigger className="max-w-fit pt-0 pb-0 border-none">
                    <SelectValue defaultChecked={lead.status} />
                  </SelectTrigger>
                  <SelectContent defaultChecked={lead.status}>
                    <SelectGroup>
                      <SelectItem value="BAD_FIT">Bad Fit</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="POTENTIAL">Potential</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                      <SelectItem value="NOT_INTERESTED">
                        Not Interested
                      </SelectItem>
                      <SelectItem value="INTERESTED">Interested</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select> 
                <CardDescription>
                  {lead?.shopDetails?.description}
                </CardDescription>
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
            <Separator />
            <br />
            <CardContent className="p-6 pt-0 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <div className="font-semibold">Address Information</div>
                    <address className=" not-italic text-muted-foreground">
                      <span>{lead?.shopDetails?.billingAddress?.company}</span>
                      <span>{lead?.shopDetails?.billingAddress?.address1}</span>
                      {lead?.shopDetails?.billingAddress?.address2 && (
                        <span>
                          {lead?.shopDetails?.billingAddress?.address2}
                        </span>
                      )}
                      <span>{`${lead?.shopDetails?.billingAddress?.city}, ${lead?.shopDetails?.billingAddress?.country} ${lead?.shopDetails?.billingAddress?.zip}`}</span>
                    </address>
                  </div>
                </div>
                {/* <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">
                    Same as shipping address
                  </div>
                </div> */}
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
                    <dt className="text-muted-foreground">Store Email</dt>
                    <dd>
                      <a href="mailto:">{lead?.shopDetails?.email}</a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">
                        {lead?.shopDetails?.billingAddress?.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                <div className="text-xs text-muted-foreground">
                  Intstalled {DateHelper.formatTimestamp(lead.createdAt ?? "")}
                </div>
              </div>
            </CardFooter>
          </Card>
          <Separator className="my-4" />
          <ExpandableContactCard integrationId={lead.integrationId} />
        </div>
        <Separator orientation="vertical" />
        <div className="w-3/4">
          <Tabs lead={lead} />
          <div className="h-screen overflow-scroll p-5">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
