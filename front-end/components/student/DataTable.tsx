"use client";
import Swal from "sweetalert2";
import Course from "@/lib/axios/course";
import LoginLooading from "../loading/login";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
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
import Cookies from "universal-cookie";
import downloadToExcel from "./xslx";

interface DataTableProps<TData, TValue, fetch> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetch: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fetch,
}: DataTableProps<any, TValue, any>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const token: string = new Cookies().get("token") as string;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    getRowId: (row) => row?.id,
  });

  return (
    <div className="sm:px-0 px-3">
      {/* input */}
      <div className="flex items-center py-4 gap-3 sm:flex-row flex-col">
        <Input
          placeholder="Tìm khóa học"
          value={(table.getColumn("title")?.getFilterValue() as string) || ""}
          onChange={(e) => {
            table.getColumn("title")?.setFilterValue(e.target.value);
          }}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => {
            // Assuming 'dayOfWeek' is the field that contains the day of the week
            value === "All"
              ? table.getColumn("date")?.setFilterValue(undefined)
              : table.getColumn("date")?.setFilterValue(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Day per week</SelectLabel>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
              <SelectItem value="Sunday">Sunday</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center">
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
        </div>
      </div>

      {/* table */}
      <div className="flex flex-col items-center pb-5">
        <div className="rounded-md border sm:w-[100%] w-[80%]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="py-3">
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
        <div className="flex justify-between items-center gap-5">
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
          {loading ? (
            <LoginLooading />
          ) : (
            <Button
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
                    setLoading(true);
                    // fetch()
                    let courseIds = table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    console.log(courseIds);
                    const rs: any = await Course.AddStudentToCourse({
                      token,
                      courseIds,
                    });
                    if (rs?.success) {
                      fetch();
                    }
                    setLoading(false);
                    Swal.fire({
                      title: rs?.mess,
                      icon: rs?.success ? "success" : "error",
                      text: rs?.success
                        ? "Your changes have been saved."
                        : "Something went wrong",
                    });
                  } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                  }
                });
              }}
            >
              Submit
            </Button>
          )}
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
      </div>
    </div>
  );
}

export default DataTable;
