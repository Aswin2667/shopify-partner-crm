import { Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const customFields = [
  "Current Vendor/Software",
  "Industry",
  "Lead Owner",
  "Referral Source",
];

export default function LeadFilter({ onBackClick }: any) {
  const [shopifyDomain, setshopifyDomain] = useState(false);
  const [leadStatus, setLeadStatus] = useState(false);


  return (
    <div className=" flex flex-col">
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
          <div className="flex items-center ">
            <Checkbox
              id="Lead Domain"
              className="mr-2"
              checked={shopifyDomain}
              onCheckedChange={(checked) =>
                setshopifyDomain(checked as boolean)
              }
            />
            <label htmlFor="anyText" className="text-sm font-medium">
            Lead Domain
            </label>
          </div>
          {shopifyDomain && (
            <>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="contains exact words..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">
                    contains exact words...
                  </SelectItem>
                  <SelectItem value="does-not-contain">
                    does not contain exact words...
                  </SelectItem>
                  <SelectItem value="contains-phrase">
                    contains phrase...
                  </SelectItem>
                  <SelectItem value="does-not-contain-phrase">
                    does not contain phrase...
                  </SelectItem>
                  <SelectItem value="starts-with">
                    contains words starting with...
                  </SelectItem>
                  <SelectItem value="does-not-start-with">
                    does not contain words starting...
                  </SelectItem>
                  <SelectItem value="is-exactly">is exactly...</SelectItem>
                  <SelectItem value="is-not-exactly">
                    is not exactly...
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input className="" placeholder="e.g. John.myshopify.com" />
            </>
          )}
          <div className="flex items-center">
            <Checkbox
              id="Current Status"
              className="mr-2"
              checked={leadStatus}
              onCheckedChange={(checked) =>
                setLeadStatus(checked as boolean)
              }
            />
            <label htmlFor="anyText" className="text-sm font-medium">
            Current Status
            </label>
          </div>
          {leadStatus && (
            <>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="is Any of" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">
                    is not any of
                  </SelectItem>
                  <SelectItem value="does-not-contain">
                  is Any of
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input className="" placeholder="e.g. John.myshopify.com" />
            </>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">
          CUSTOM FIELDS
        </h3>
        {customFields.map((field, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Checkbox id={`custom-${index}`} />
            <label htmlFor={`custom-${index}`} className="text-sm">
              {field}
            </label>
          </div>
        ))}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
}
