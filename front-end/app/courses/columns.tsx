import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export type Course = {
  id: string;
  title: string;
  status: "pending" | "processing" | "success" | "failed";
  course_id: string;
  description: string;
  image: string;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "Image",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <img
          src={row.original.image}
          className="w-24 lg:w-32 rounded-md object-center"
        />
      );
    },
  },
  {
    accessorKey: "Courses",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          <Button className="p-0 text-lg font-bold capitalize" variant="link">
            {row.original.title}
          </Button>
          <div></div>
          <div className="text-xs capitalize">{row.original.course_id}</div>
          <div>{row.original.description}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href={{
                  pathname: "/admin/courses/edit",
                  query: { id: id },
                }}
              >
                Edit course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete course</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
