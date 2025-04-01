"use client";
import React from "react";
import Post from "@/lib/axios/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
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

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetch: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { toast } = useToast();
  // console.log(data);
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
  });

  return (
    <div>
      {/* input */}
      <div className="flex items-center py-4 gap-3 sm:flex-row flex-col ml-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm tên thread"
            value={(table.getColumn("title")?.getFilterValue() as string) || ""}
            onChange={(e) => {
              table.getColumn("title")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
          />
          <Button
            variant={"destructive"}
            onClick={async () => {
              const idArr: any = [];
              table.getFilteredSelectedRowModel().rows.forEach((row: any) => {
                idArr.push(row.original.id);
              });
              // console.log(idArr);
              const rs: any = await Post.DeleteThread(idArr);
              console.log(rs);
              if (rs?.success) {
                fetch();
                toast({
                  variant: "default",
                  title: "Success!",
                  description: rs?.mess,
                });
              } else
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: rs?.mess,
                });
            }}
          >
            Xóa
          </Button>
        </div>
        <div className="flex items-center gap-3"></div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
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
