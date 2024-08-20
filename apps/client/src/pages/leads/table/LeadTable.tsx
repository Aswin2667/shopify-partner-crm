import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./components/data-table-pagination";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LeadService from "@/services/LeadService";
import { toast } from "@/components/ui/use-toast";
import DateHelper from "@/utils/DateHelper";
import { useNavigate } from "react-router-dom";

export default function LeadTable() {
  const [leads, setLeads] = React.useState([]);
  const { currentIntegration } = useSelector((state: any) => state.integration);

  useEffect(() => {
    const fetchLeads = async () => {
      if (currentIntegration?.id) {
        try {
          const response: any = await LeadService.getByIntegrationId(currentIntegration.id);
          if (response.status) {
            setLeads(response.data.data);
          } else {
            toast({
              title: response.message,
              description: DateHelper.formatTimestamp(DateHelper.getCurrentUnixTime()),
              duration: 1000,
              variant: `${response.status ? "default" : "destructive"}`,
            });
          }
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching leads:", error);
        }
      }
    };

    fetchLeads();
  }, [currentIntegration]);

  return (
    <div className="p-5">
      <DataTable data={leads} />
    </div>
  );
}

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "shopifyDomain",
    header: "Shopify Domain",
    cell: ({ row }) =>  {
      const navigate = useNavigate()
      console.log(row)
      return <div onClick={() => navigate(`${row.original?.id}`)}  className="w-[80px] hover:underline hover:text-blue-600 hover:cursor-pointer">{row.getValue("shopifyDomain")}</div>
    },
  },
  {
    accessorKey: "leadSource",
    header: "Lead Source",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("leadSource")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header:()=> <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      const createdAt = parseInt(row.getValue("createdAt"));
      return (
        <div className="min-w-full text-center">
          {DateHelper.formatTimestamp(createdAt)} {/* Assuming formatTimestamp is implemented */}
        </div>
      );
    },
  }
];

export function DataTable({ data }: { data: any[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between min-w-full py-4">
        <Input
          placeholder="Filter domains..."
          value={(table.getColumn("shopifyDomain")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("shopifyDomain")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableToolbar />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
