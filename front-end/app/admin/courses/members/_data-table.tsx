"use client";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
import { Checkbox } from "@/components/ui/checkbox";
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
import LoginLooading from "@/components/loading/login";
import Course from "@/lib/axios/course";
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
import { useState } from "react";
import { Check, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchData: any;
  fetchData_not: any;
  addition: any;
  setAddition: any;
  other: any;
}

export function _DataTable<TData, TValue>({
  columns,
  data,
  fetchData,
  fetchData_not,
  addition,
  setAddition,
  other,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [loading, setLoading] = useState<any>(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  console.log(rowSelection);
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
    <div className="flex lg:flex-row flex-col gap-3 mt-5 bg-background p-5 rounded-lg shadow-lg relative lg:justify-center">
      {/* input */}
      <Button
        variant={"ghost"}
        onClick={() => setAddition(false)}
        className="absolute top-1 right-1"
      >
        <X />
      </Button>
      <div>
        <div className="grid lg:grid-cols-1 grid-cols-2 gap-3 mt-5 justify-start">
          <Input
            placeholder="Filter mssv"
            value={(table.getColumn("mssv")?.getFilterValue() as string) || ""}
            onChange={(e) => {
              table.getColumn("mssv")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Input
            placeholder="Filter first names"
            value={
              (table.getColumn("firstname")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              table.getColumn("firstname")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Input
            placeholder="Filter last names"
            value={
              (table.getColumn("lastname")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              table.getColumn("lastname")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Select
            onValueChange={(e) => {
              if (e != "ALL") table.getColumn("role")?.setFilterValue(e);
              else table.getColumn("role")?.setFilterValue("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="ALL">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* table */}
      <div className="flex flex-col mt-5">
        <div className="rounded-md border">
          <Table>
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
        <div className="flex items-center justify-between">
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
          <Button variant={"outline"} className="flex gap-3 items-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value: any) => {
                table.toggleAllPageRowsSelected(!!value);
              }}
            />
            Chọn tất cả
          </Button>
          {loading ? (
            <LoginLooading />
          ) : (
            <Button
              className="rounded-full"
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
                    const selectedRows = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row: any) => row.original.id);
                    // console.log(selectedRows);
                    await Course.AddManyUserToCourse(
                      other.id,
                      selectedRows,
                      other.token,
                    ).then((res: any) => {
                      if (res?.success) {
                        fetchData();
                        fetchData_not();
                        setAddition(false);
                        Swal.fire(
                          "Saved!",
                          "Members attend course successfully",
                          "success",
                        );
                        setLoading(false);
                      } else {
                        Swal.fire("Failed!", res?.mess, "error");
                        setLoading(false);
                      }
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

export default _DataTable;
