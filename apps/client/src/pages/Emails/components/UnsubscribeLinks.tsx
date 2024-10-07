import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Pencil, Copy, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
 import { Card } from "@/components/ui/card";

export default function Component() {
  const navigate = useNavigate();
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(true);

  const { unsubscribeLinks } = useSelector((state: any) => state.organization);
  console.log(unsubscribeLinks);

  const renderTableContent = () => {
    if (unsubscribeLinks.length === 0) {
      return (
        <Card className="text-center py-10">
          <p className="text-gray-500 mb-4">No unsubscribe links found</p>
          <Button onClick={() => navigate("new")}>
            <Plus className="h-4 w-4 mr-2" /> Create Unsubscribe Link
          </Button>
        </Card>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" w-1/4">Name</TableHead>
            <TableHead className="w-1/2">Message with Anchor Text</TableHead>
            <TableHead className=" w-1/4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {unsubscribeLinks.map((link: any) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">{link.name}</TableCell>
              <TableCell>
                {link.message}{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  {link.anchorText}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="border">
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link to={link.id}>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="unsubscribe-toggle" className="text-sm font-medium">
            Always include an unsubscribe link in Bulk Emails and Workflows
          </label>
          <Switch
            id="unsubscribe-toggle"
            checked={includeUnsubscribe}
            onCheckedChange={setIncludeUnsubscribe}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          If an automated email does not have an unsubscribe link,{" "}
          <span className="text-blue-600">the default link</span> will be
          appended automatically.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Unsubscribe Links</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input placeholder="Filter Link..." className="pl-8 max-w-sm" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-2.5 top-3 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {unsubscribeLinks.length < 0 && (
          <Button onClick={() => navigate("new")}>
            <Plus className="h-4 w-4 mr-2" /> New Link
          </Button>
        )}
      </div>

      {renderTableContent()}
    </div>
  );
}

{
  /* <TableRow>
  <TableCell className="font-medium">
    <span className="text-blue-600">Default Unsubscribe Link</span>
    <span className="ml-2 text-xs bg-gray-200 text-gray-800 px-1 py-0.5 rounded">
      DEFAULT
    </span>
  </TableCell>
  <TableCell>To stop receiving these emails, click here</TableCell>
  <TableCell>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to={"new"}>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
</TableRow>; */
}
