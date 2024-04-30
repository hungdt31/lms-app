"use client";
import { UserX } from "lucide-react";
import Swal from "sweetalert2";
import { X, Check, PenLine } from "lucide-react";
import Cookies from "universal-cookie";
import { useToast } from "../ui/use-toast";
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
import User from "@/lib/axios/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import downloadToExcel from "./xslx";
import { useState } from "react";
import { ToastAction } from "../ui/toast";
interface DataTableProps<TData, TValue, fetch> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  query: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  query,
}: DataTableProps<any, TValue, any>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [arr, setArr] = useState<any>(data);
  const [orginalData, setOrginalData] = useState<any>(data);
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // console.log(rowSelection);
  const token: string = new Cookies().get("token") || "";
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
    <div>
      {/* input */}
      <div className="flex items-center py-4 gap-3 sm:flex-row flex-col">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search first names"
            value={
              (table.getColumn("firstname")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              table.getColumn("firstname")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Input
            placeholder="Search last names"
            value={
              (table.getColumn("lastname")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              table.getColumn("lastname")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Input
            placeholder="Search email"
            value={(table.getColumn("email")?.getFilterValue() as string) || ""}
            onChange={(e) => {
              table.getColumn("email")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => downloadToExcel(data)} className="ml-4">
            Export to Excel
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="ml-4">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) => {
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={"destructive"}
            onClick={() => {
              Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`,
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  const selectedRows = table
                    .getFilteredSelectedRowModel()
                    .rows.map((row: any) => row.original.id);
                  const rs: any = await User.DeleteUser(token, selectedRows);
                  if (rs?.success) {
                    query.refetch();
                  }
                  Swal.fire({
                    title: rs?.message,
                    icon: rs?.success ? "success" : "error",
                    text: rs?.mess,
                  });
                  console.log(selectedRows);
                } else if (result.isDenied) {
                  Swal.fire("Changes are not saved", "", "info");
                }
              });
            }}
          >
            <UserX />
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {row.getIsSelected() ? (
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => {
                            row.toggleSelected(false);
                            query.refetch();
                          }}
                          variant={"secondary"}
                        >
                          <X />
                        </Button>
                        <Button
                          variant={"secondary"}
                          onClick={async () => {
                            const rs: any = await User.UpdateUserByAdmin(
                              token,
                              row.original,
                            );
                            if (rs?.success) {
                              query.refetch();
                              toast({
                                variant: "default",
                                title: "Your change has been saved.",
                                description: rs?.mess,
                              });
                              row.toggleSelected(false);
                            } else {
                              toast({
                                variant: "destructive",
                                title: "Uh oh! Something went wrong.",
                                description: rs?.mess,
                                action: (
                                  <ToastAction altText="Try again">
                                    Try again
                                  </ToastAction>
                                ),
                              });
                            }
                          }}
                        >
                          <Check />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          row.toggleSelected(true);
                        }}
                        variant={"secondary"}
                      >
                        <PenLine />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No results</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
}

export default DataTable;
