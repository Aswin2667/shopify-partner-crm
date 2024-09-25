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

  const orgId = window.location.pathname.split("/")[1];

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
              onCheckedChange={() => setContactName(!contactName)}
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
              />
              <Input placeholder="e.g. Alex" />
            </>
          )}

          {/* Title Filter */}
          <div className="flex items-center">
            <Checkbox
              id="Title"
              className="mr-2"
              checked={title}
              onCheckedChange={() => setTitle(!title)}
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
              />
              <Input placeholder="e.g. Sales" />
            </>
          )}

          <div className="flex items-center">
            <Checkbox
              id="EmailAddress"
              className="mr-2"
              checked={emailAddress}
              onCheckedChange={() => setEmailAddress(!emailAddress)}
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
              />
              <Input placeholder="e.g. example@email.com" />
            </>
          )}

          <div className="flex items-center">
            <Checkbox
              id="Unsubscribed"
              className="mr-2"
              checked={unsubscribed}
              onCheckedChange={() => setUnsubscribed(!unsubscribed)}
            />
            <label htmlFor="Unsubscribed" className="text-sm font-medium">
              Unsubscribed
            </label>
          </div>
          {unsubscribed && (
            <RadioGroup defaultValue="comfortable" className="flex gap-5 p-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">No</Label>
              </div>
            </RadioGroup>
          )}

          <div className="flex items-center">
            <Checkbox
              id="CreatedAt"
              className="mr-2"
              checked={createdAt}
              onCheckedChange={() => setCreatedAt(!createdAt)}
            />
            <label htmlFor="CreatedAt" className="text-sm font-medium">
              Created At
            </label>
          </div>
          {createdAt && <DatePickerSelect />}
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

