import { useState } from "react";
import { Calendar, User, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Filter() {
  const [anyTextChecked, setAnyTextChecked] = useState(false);
  const [dateOfStatusChecked, setDateOfStatusChecked] = useState(false);
  const [dateCreatedChecked, setDateCreatedChecked] = useState(false);
  const [dateLastUpdatedChecked, setDateLastUpdatedChecked] = useState(false);
  const [createdByChecked, setCreatedByChecked] = useState(false);
  const [lastUpdatedByChecked, setLastUpdatedByChecked] = useState(false);
  const [leadSourceChecked, setLeadSourceChecked] = useState(false);

  return (
    // <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
    <>
      <div className="p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Find a Filter..."
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700">
            Find Leads where...
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="anyText"
                className="mr-2"
                checked={anyTextChecked}
                onCheckedChange={(checked) =>
                  setAnyTextChecked(checked as boolean)
                }
              />
              <label htmlFor="anyText" className="text-sm font-medium">
                Any text
              </label>
            </div>
            {anyTextChecked && (
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
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="dateOfStatus"
                className="mr-2"
                checked={dateOfStatusChecked}
                onCheckedChange={(checked) =>
                  setDateOfStatusChecked(checked as boolean)
                }
              />
              <label
                htmlFor="dateOfStatus"
                className="text-sm font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" /> Date of status
              </label>
            </div>
            {dateOfStatusChecked && (
              <>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="is..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="is">is...</SelectItem>
                    <SelectItem value="is-not">is not...</SelectItem>
                    <SelectItem value="is-after">is after...</SelectItem>
                    <SelectItem value="is-before">is before...</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="last-week">Last week</SelectItem>
                    <SelectItem value="this-month">This month</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="dateCreated"
                className="mr-2"
                checked={dateCreatedChecked}
                onCheckedChange={(checked) =>
                  setDateCreatedChecked(checked as boolean)
                }
              />
              <label
                htmlFor="dateCreated"
                className="text-sm font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" /> Date created
              </label>
            </div>
            {dateCreatedChecked && (
              <>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="is..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="is">is...</SelectItem>
                    <SelectItem value="is-not">is not...</SelectItem>
                    <SelectItem value="is-after">is after...</SelectItem>
                    <SelectItem value="is-before">is before...</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="last-week">Last week</SelectItem>
                    <SelectItem value="this-month">This month</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <div className="flex items-center">
            <Checkbox
              id="dateLastUpdated"
              className="mr-2"
              checked={dateLastUpdatedChecked}
              onCheckedChange={(checked) =>
                setDateLastUpdatedChecked(checked as boolean)
              }
            />
            <label
              htmlFor="dateLastUpdated"
              className="text-sm font-medium flex items-center"
            >
              <Calendar className="h-4 w-4 mr-1" /> Date last updated
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="createdBy"
              className="mr-2"
              checked={createdByChecked}
              onCheckedChange={(checked) =>
                setCreatedByChecked(checked as boolean)
              }
            />
            <label
              htmlFor="createdBy"
              className="text-sm font-medium flex items-center"
            >
              <User className="h-4 w-4 mr-1" /> Created by
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="lastUpdatedBy"
              className="mr-2"
              checked={lastUpdatedByChecked}
              onCheckedChange={(checked) =>
                setLastUpdatedByChecked(checked as boolean)
              }
            />
            <label
              htmlFor="lastUpdatedBy"
              className="text-sm font-medium flex items-center"
            >
              <User className="h-4 w-4 mr-1" /> Last updated by
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="leadSource"
              className="mr-2"
              checked={leadSourceChecked}
              onCheckedChange={(checked) =>
                setLeadSourceChecked(checked as boolean)
              }
            />
            <label
              htmlFor="leadSource"
              className="text-sm font-medium flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" /> Lead source
            </label>
          </div>
        </div>
      </div>
      {/* <div className="p-4 border-t flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Done</Button>
      </div> */}
    </>
  );
}
