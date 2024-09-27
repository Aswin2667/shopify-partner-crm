import { Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Select from "react-select";
import DatePickerSelect from "./dateFilters/DateFilter";

export default function ContactFilter({ onBackClick }: any) {
  const [contactName, setContactName] = useState(false);
  const [title, setTitle] = useState(false);
  const [emailAddress, setEmailAddress] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [createdAt, setCreatedAt] = useState(false);
  const [filters, setFilters] = useState({
    contactNameFilter: "",
    titleFilter: "",
    emailAddressFilter: "",
    unsubscribedFilter: null,
    createdAtFilter: null,
  });

  const orgId = window.location.pathname.split("/")[1];

  // Function to build SQL query based on selected filters
  const buildSQLQuery = () => {
    let whereClause = "1=1"; // Default to true

    if (filters.contactNameFilter) {
      whereClause += ` AND c.firstName ILIKE '%${filters.contactNameFilter}%'`;
    }
    if (filters.titleFilter) {
      whereClause += ` AND c.title ILIKE '%${filters.titleFilter}%'`;
    }
    if (filters.emailAddressFilter) {
      whereClause += ` AND c.primaryEmail ILIKE '%${filters.emailAddressFilter}%'`;
    }
    if (filters.unsubscribedFilter !== null) {
      whereClause += ` AND c.unsubscribed = ${filters.unsubscribedFilter}`;
    }
    if (filters.createdAtFilter) {
      whereClause += ` AND c.createdAt >= '${filters.createdAtFilter}'`;
    }

    const sqlQuery = `
      SELECT 
        l.id, 
        l."shopifyDomain", 
        l."shopifyStoreId", 
        l."leadSource", 
        l."shopDetails", 
        l.industry, 
        l."createdAt", 
        l."updatedAt", 
        l."deletedAt", 
        l."integrationId", 
        l."organizationId",
        COUNT(lp."projectId") AS projectCount,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'name', p.name,
              'type', p.type,
              'data', p.data,
              'isSynced', p."isSynced",
              'createdAt', p."createdAt",
              'updatedAt', p."updatedAt"
            )
          ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
        ) AS projects,
        ls.status AS leadStatus
      FROM "Lead" l
      LEFT JOIN "LeadProject" lp ON l.id = lp."leadId"
      LEFT JOIN "Project" p ON lp."projectId" = p.id
      LEFT JOIN "LeadStatus" ls ON l."statusId" = ls.id
      LEFT JOIN "Contact" c ON c.leadId = l.id
      WHERE l."organizationId" = '${orgId}' AND ${whereClause}
      GROUP BY l.id, ls.status
      ORDER BY l."createdAt" DESC;
    `;

    console.log(sqlQuery); // Log the constructed SQL query
  };

  useEffect(() => {
    buildSQLQuery(); // Call the function to build and log the SQL query
  }, [filters]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center ">
        <Button
          variant="ghost"
          size="icon"
          className="pr-2 pl-2 pt-0 pb-0 mb-2"
          onClick={onBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <SheetHeader className="min-w-full flex items-center justify-center">
          <SheetTitle>Contacts</SheetTitle>
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
              id="ContactName"
              className="mr-2"
              checked={contactName}
              onCheckedChange={() => {
                setContactName(!contactName);
                setFilters({ ...filters, contactNameFilter: "" }); // Reset filter
              }}
            />
            <label htmlFor="ContactName" className="text-sm font-medium">
              Contact Name
            </label>
          </div>
          {contactName && (
            <>
              <Select
                options={[
                  { value: "contains", label: "contains exact words..." },
                  {
                    value: "does-not-contain",
                    label: "does not contain exact words...",
                  },
                  { value: "contains phrase", label: "contains phrase..." },
                  {
                    value: "does not contain phrase",
                    label: "does not contain phrase...",
                  },
                  {
                    value: "contains words starting with",
                    label: "contains words starting with...",
                  },
                  {
                    value: "does not contain words starting",
                    label: "does not contain words starting...",
                  },
                  { value: "is exactly", label: "is exactly..." },
                  { value: "is not exactly", label: "is not exactly..." },
                ]}
                placeholder="Select Filter..."
                className="mb-4"
                onChange={(selectedOption) => {
                  const value = selectedOption?.value || "";
                  setFilters({ ...filters, contactNameFilter: value });
                }}
              />
              <Input placeholder="e.g. Alex" onChange={(e) => setFilters({ ...filters, contactNameFilter: e.target.value })} />
            </>
          )}

          {/* Title Filter */}
          <div className="flex items-center">
            <Checkbox
              id="Title"
              className="mr-2"
              checked={title}
              onCheckedChange={() => {
                setTitle(!title);
                setFilters({ ...filters, titleFilter: "" }); // Reset filter
              }}
            />
            <label htmlFor="Title" className="text-sm font-medium">
              Title
            </label>
          </div>
          {title && (
            <>
              <Select
                options={[
                  { value: "contains", label: "contains exact words..." },
                  {
                    value: "does-not-contain",
                    label: "does not contain exact words...",
                  },
                  { value: "contains phrase", label: "contains phrase..." },
                  {
                    value: "does not contain phrase",
                    label: "does not contain phrase...",
                  },
                  {
                    value: "contains words starting with",
                    label: "contains words starting with...",
                  },
                  {
                    value: "does not contain words starting",
                    label: "does not contain words starting...",
                  },
                  { value: "is exactly", label: "is exactly..." },
                  { value: "is not exactly", label: "is not exactly..." },
                ]}
                placeholder="Select Filter..."
                className="mb-4"
                onChange={(selectedOption) => {
                  const value = selectedOption?.value || "";
                  setFilters({ ...filters, titleFilter: value });
                }}
              />
              <Input placeholder="e.g. Sales" onChange={(e) => setFilters({ ...filters, titleFilter: e.target.value })} />
            </>
          )}

          <div className="flex items-center">
            <Checkbox
              id="EmailAddress"
              className="mr-2"
              checked={emailAddress}
              onCheckedChange={() => {
                setEmailAddress(!emailAddress);
                setFilters({ ...filters, emailAddressFilter: "" }); // Reset filter
              }}
            />
            <label htmlFor="EmailAddress" className="text-sm font-medium">
              Email Address
            </label>
          </div>
          {emailAddress && (
            <>
              <Select
                options={[
                  { value: "contains", label: "contains exact words..." },
                  {
                    value: "does-not-contain",
                    label: "does not contain exact words...",
                  },
                  { value: "contains phrase", label: "contains phrase..." },
                  {
                    value: "does not contain phrase",
                    label: "does not contain phrase...",
                  },
                  {
                    value: "contains words starting with",
                    label: "contains words starting with...",
                  },
                  {
                    value: "does not contain words starting",
                    label: "does not contain words starting...",
                  },
                  { value: "is exactly", label: "is exactly..." },
                  { value: "is not exactly", label: "is not exactly..." },
                ]}
                placeholder="Select Filter..."
                className="mb-4"
                onChange={(selectedOption) => {
                  const value = selectedOption?.value || "";
                  setFilters({ ...filters, emailAddressFilter: value });
                }}
              />
              <Input placeholder="e.g. example@mail.com" onChange={(e) => setFilters({ ...filters, emailAddressFilter: e.target.value })} />
            </>
          )}
          <div className="flex items-center">
            <Checkbox
              id="Unsubscribed"
              className="mr-2"
              checked={unsubscribed}
              onCheckedChange={() => {
                setUnsubscribed(!unsubscribed);
                setFilters({ ...filters, unsubscribedFilter: null });
              }}
            />
            <label htmlFor="Unsubscribed" className="text-sm font-medium">
              Unsubscribed
            </label>
          </div>
          {unsubscribed && (
            <RadioGroup
              value={filters.unsubscribedFilter??""}
              onValueChange={(value) => setFilters({ ...filters, unsubscribedFilter: value }as any)}
            >
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <RadioGroupItem value="true" id="unsubscribed-true" />
                  <Label htmlFor="unsubscribed-true">Yes</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="false" id="unsubscribed-false" />
                  <Label htmlFor="unsubscribed-false">No</Label>
                </div>
              </div>
            </RadioGroup>
          )}

          <div className="flex items-center">
            <Checkbox
              id="CreatedAt"
              className="mr-2"
              checked={createdAt}
              onCheckedChange={() => {
                setCreatedAt(!createdAt);
                setFilters({ ...filters, createdAtFilter: null }); // Reset filter
              }}
            />
            <label htmlFor="CreatedAt" className="text-sm font-medium">
              Created At
            </label>
          </div>
          {createdAt && (
            <DatePickerSelect
              onChange={(date:any) => setFilters({ ...filters, createdAtFilter: date })}
            />
          )}
        </div>
      </div>
      <SheetFooter>
        <Button type="button" onClick={() => console.log(filters)}>
          Apply Filters
        </Button>
      </SheetFooter>
    </div>
  );
}