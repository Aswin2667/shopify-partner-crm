import { Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import LeadStatusService from "@/services/LeadStatusService";
import Select from "react-select";
import DatePickerSelect from "./dateFilters/DateFilter";
import LeadService from "@/services/LeadService";
import { useDispatch } from "react-redux";
import { leadsAction } from "@/redux/LeadSlice";
 
export default function LeadFilter({ onBackClick }: any) {
  const [shopifyDomain, setShopifyDomain] = useState(false);
  const [leadStatus, setLeadStatus] = useState(false);
  const [createdAt, setCreatedAt] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [availableLeadStatus, setAvailableLeadStatus] = useState([]);
  const [domainFilterOption, setDomainFilterOption] = useState<any>(null);
  const [domainValue, setDomainValue] = useState("");
 const [statusFilterOption,setStatusFilterOption] = useState<any>(null);
  const orgId = window.location.pathname.split("/")[1];

  const [selectedDateComparison, setSelectedDateComparison] = useState<any>(null);
  const [selectedDateOption, setSelectedDateOption] = useState<any>(null);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  useEffect(() => {
    const getAvailableLeadStatus = async () => {
      const response = await LeadStatusService.getAllByOrgId(orgId);
      setAvailableLeadStatus(response?.data.data);
    };
    getAvailableLeadStatus();
  }, [orgId]);

  const dispatch = useDispatch();

   useEffect(() => {
    handleFiltersChange();
  }, [shopifyDomain, domainFilterOption, domainValue, leadStatus, selectedStatuses, createdAt,statusFilterOption,selectedDateComparison,selectedDateOption,customDate]);

  const handleStatusChange = (selectedOptions: any) => {
    setSelectedStatuses(selectedOptions);
  };

  const handleShopifyDomainChange = (checked: boolean) => {
    setShopifyDomain(checked);
  };

  const handleLeadStatusChange = (checked: boolean) => {
    setLeadStatus(checked);
  };

  const handleCreatedAtChange = (checked: boolean) => {
    setSelectedDateComparison(null);
    setSelectedDateOption(null);
    setCustomDate(null);
    setCreatedAt(checked);
  };

  const handleDomainFilterOptionChange = (option: any) => {
    setDomainFilterOption(option);
  };

  const handleDomainValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainValue(event.target.value);
  };
  const handleStatusFilterOptionChange = (option: any) => {
    setStatusFilterOption(option);
  }
   const handleFiltersChange = async () => {
    try {

    const filters = {
      shopifyDomain: shopifyDomain ? domainValue : undefined,
      domainFilterOption: domainFilterOption?.value || undefined,
      leadStatus: selectedStatuses ? selectedStatuses.map((status: any) => status.value) : [],
      createdAt: createdAt ? {/* Your date range logic here */} : undefined,
      statusFilterOption: statusFilterOption?.value || undefined,
      selectedDateComparison: selectedDateComparison?.value || undefined,
      selectedDateOption: selectedDateOption?.value || undefined,
      customDate: customDate || undefined,
    };
    const EnabledFilters = true
     dispatch(leadsAction.setfiltersEnabled(EnabledFilters as any));
      const response = await LeadService.getLeadsByOrganizationId(
        orgId, filters.shopifyDomain, filters.domainFilterOption, selectedStatuses, filters.createdAt as any ,filters.statusFilterOption,
        selectedDateComparison,
        selectedDateOption,
        customDate
      );

       console.log("Fetched leads:", JSON.stringify(response.data.data));
       dispatch(leadsAction.setfiltersEnabled("" as any))
      dispatch(leadsAction.setLeads(response.data.data));
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const statusOptions: any = availableLeadStatus.map((status: any) => ({
    value: status.id,
    label: status.status,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBackClick}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <SheetHeader className="min-w-full flex items-center justify-center">
          <SheetTitle>Leads</SheetTitle>
        </SheetHeader>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="Find a Filter..." className="pl-10" />
      </div>
      <Separator />

      <div className="flex-grow overflow-auto">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Find Contacts on a Lead where...
        </h3>
        <div className="space-y-2 p-2">
          <div className="flex items-center">
            <Checkbox
              id="Lead Domain"
              className="mr-2"
              checked={shopifyDomain}
              onCheckedChange={handleShopifyDomainChange}
            />
            <label htmlFor="Lead Domain" className="text-sm font-medium">
              Lead Domain
            </label>
          </div>
          {shopifyDomain && (
            <>
              <Select
                options={[
                  { value: "contains", label: "contains exact words..." },
                  { value: "does-not-contain", label: "does not contain exact words..." },
                  { value: "contains phrase", label: "contains phrase..." },
                  { value: "does not contain phrase", label: "does not contain phrase..." },
                  { value: "contains words starting with", label: "contains words starting with..." },
                  { value: "does not contain words starting", label: "does not contain words starting..." },
                  { value: "is exactly", label: "is exactly..." },
                  { value: "is not exactly", label: "is not exactly..." },
                ]}
                onChange={handleDomainFilterOptionChange}
                placeholder="Select Filter..."
                className="mb-4"
              />
              <Input
                value={domainValue}
                onChange={handleDomainValueChange}
                placeholder="e.g. John.myshopify.com"
              />
            </>
          )}

          <div className="flex items-center">
            <Checkbox
              id="Current Status"
              className="mr-2"
              checked={leadStatus}
              onCheckedChange={handleLeadStatusChange}
            />
            <label htmlFor="Current Status" className="text-sm font-medium">
              Current Status
            </label>
          </div>
          {leadStatus && (
            <>
              <Select
                options={[
                  { value: "is any of", label: "is any of" },
                  { value: "is not any of", label: "is not any of" },
                ]}
                onChange={handleStatusFilterOptionChange}
                placeholder="Select Filter..."
                className="mb-4"
              />
              <Select
                isMulti
                options={statusOptions}
                value={selectedStatuses}
                onChange={handleStatusChange}
                placeholder="Select Status"
                className="mb-4"
              />
            </>
          )}

          <div className="flex items-center">
            <Checkbox
              id="Created At"
              className="mr-2"
              checked={createdAt}
              onCheckedChange={handleCreatedAtChange}
            />
            <label htmlFor="Created At" className="text-sm font-medium">
              Created At
            </label>
          </div>
          {createdAt && (
            <>
              <DatePickerSelect
               customDate={customDate}
               setCustomDate={setCustomDate}
               selectedComparison={selectedDateComparison}
               setSelectedComparison={setSelectedDateComparison}
               selectedDateOption={selectedDateOption}
               setSelectedDateOption={setSelectedDateOption}
               />
            </>
          )}
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button>Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
}