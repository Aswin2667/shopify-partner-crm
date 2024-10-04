import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, MoreHorizontal } from "lucide-react";
import axios from "axios"; // Assuming you're using axios to fetch data
import { DataTablePagination } from "./components/data-table-pagination";
import ContactService from "@/services/ContactService";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";
import LeadBadge from "@/pages/leads/components/LeadBadge";

export default function ContactTable() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(8);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { organizationId } = useParams();
  // Fetch contacts from backend API
  useEffect(() => {
    const fetchContacts = async () => {
      if (true) {
        try {
          const response: any =
            await ContactService.getByOrganizationId(organizationId);
          if (response.status) {
            setContacts(response.data);
          } else {
            toast({
              title: response.message,
              description: DateHelper.formatTimestamp(
                DateHelper.getCurrentUnixTime()
              ),
              duration: 1000,
              variant: `${response.status ? "default" : "destructive"}`,
            });
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
          toast({
            title: "Error",
            description: "An error occurred while fetching contacts.",
            duration: 1000,
            variant: "destructive",
          });
        }
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead className="font-medium"></TableHead>
            <TableHead className="font-medium">Title</TableHead>
            <TableHead className="font-medium">Lead</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : contacts?.length > 0 ? (
            contacts.map((contact: any) => (
              <TableRow
                key={contact.id}
                className="hover:bg-gray-100 p-0 pl-4 min-h-[5px] "
              >
                <TableCell className="font-medium p-0 pl-4 ">
                  {contact?.Salutation}{contact.firstName} {contact.lastName}
                </TableCell>
                <TableCell className="font-medium text-blue-600 p-0 pl-4 hover:underline cursor-pointer">
                  {contact.email}
                </TableCell>
                <TableCell className="p-0">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 p-0">
                  {contact?.title?.length > 0 ? contact?.title : "-"}
                </TableCell>
                <TableCell className="text-gray-600 p-0">
                  {contact?.lead?.shopifyDomain}
                </TableCell>
                <TableCell className="text-gray-600 p-0 text-center">
                  <LeadBadge status={contact?.lead?.status?.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No contacts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
