import { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Course from "@/lib/axios/course";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "universal-cookie";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Course = {
  id: string;
  firstname: string;
  lastname: string;
  mssv: string;
  email: string;
  role: string;
  avatar: string;
};

export const _columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mssv",
    header: "",
    cell: ({ row }) => {
      row.original.mssv =
        row.original.role == "STUDENT" ? row.original.mssv : "";
      return <p></p>;
    },
  },
  {
    accessorKey: "role",
    header: "",
    cell: ({ row }) => {
      return <div></div>;
    },
  },
  {
    accessorKey: "firstname",
    header: "",
    cell: ({ row }) => {
      return <div></div>;
    },
  },
  
  {
    header: "Người dùng",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.firstname[0]}{row.original.lastname[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="flex items-center gap-3">
            <h1 className="font-bold">{row.original.firstname} {row.original.lastname}</h1>
            
            </p>
            <p className="text-gray-500 text-[12px]">{row.original.mssv} - {row.original.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: "",
    cell: ({ row }) => {
      return <div><Badge className="text-[10px]" variant={"secondary"}>{row.original.role}</Badge></div>;
    },
  },
];
export default _columns;
