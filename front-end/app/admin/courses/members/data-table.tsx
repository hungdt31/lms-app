"use client";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import downloadToExcel from "./xslx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseInfo: any;
  fetchData: any;
  other: any;
  addition: any;
  setAddition: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  courseInfo,
  fetchData,
  other,
  addition,
  setAddition,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  console.log(rowSelection);
  const { toast } = useToast();
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
      <div className="flex items-center py-4 gap-3 lg:flex-row flex-col">
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
        <div className="flex items-center gap-3">
          <Button
            onClick={() => downloadToExcel(data, courseInfo)}
            className="ml-4"
          >
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
      <div className="rounded-md border">
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
        <div className="flex items-center gap-3 flex-wrap">
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
                  // console.log(selectedRows);
                  await Course.MoveUserOutOfCourse(
                    other.id,
                    selectedRows,
                    other.token,
                  ).then((res: any) => {
                    if (res?.success) {
                      fetchData();
                      Swal.fire(
                        "Saved!",
                        "Members leave course successfully",
                        "success",
                      );
                    } else {
                      Swal.fire("Failed!", "Something're wrong", "error");
                    }
                  });
                } else if (result.isDenied) {
                  Swal.fire("Changes are not saved", "", "info");
                }
              });
            }}
          >
            Rời khỏi khóa học
          </Button>

          <Button onClick={() => setAddition(true)}>Thêm thành viên</Button>
        </div>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
}

export default DataTable;
