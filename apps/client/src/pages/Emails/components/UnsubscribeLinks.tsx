import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";

export default function UnsubscribeLinks() {
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(false);

  return (
    <div className=" ">
      <div className="space-y-4">
        <br />
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Filter Link..." className="pl-8" />
          </div>
          <Button>+ New Link</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Message</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Default Unsubscribe Link
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 rounded">
                  DEFAULT
                </span>
              </TableCell>
              <TableCell>To stop receiving these emails, click here</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <br />

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="unsubscribe-link"
                checked={includeUnsubscribe}
                onCheckedChange={setIncludeUnsubscribe}
              />
              <label
                htmlFor="unsubscribe-link"
                className="text-sm font-medium text-gray-900"
              >
                Always include an unsubscribe link in Bulk Emails and Workflows
              </label>
            </div>
            <p className="text-sm text-gray-500">
              If an automated email does not have an unsubscribe link,{" "}
              <span className="text-blue-600">the default link</span> will be
              appended automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
