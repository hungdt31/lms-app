"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
export type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  email: string;
  phone: string;
};
export type CouseInfo = {
  id: string;
  title: string;
  course_id: string;
  date: string;
  schedule: Array<number>;
  usersId: boolean;
  quantity: number;
  _count: {
    users: number;
  };
};
export type StudentInfo = {
  id: string;
  avatar: string;
  firstname: string;
  lastname: string;
  email: string
};
export const columns: ColumnDef<UserInfo>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Person ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "id",
  },
  {
    accessorKey: "firstname",
    header: "First name",
  },
  {
    accessorKey: "lastname",
    header: "Last name",
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of birth",
    cell: ({ row }) => {
      const date_of_birth = row.getValue("date_of_birth");
      const formatted = new Date(date_of_birth as string).toUTCString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const person = row.original;
      const personId = person.id;
      const cid: string = useSearchParams().get("id") as string;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(person.email.toString());
              }}
            >
              Copy person email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(
                  person?.phone?.toString() || "none",
                );
              }}
            >
              Copy person phone
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/stinfo?id=${person?.id}&cid=${cid}`,
                );
              }}
            >
              Go to detail student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const semester_columns: ColumnDef<CouseInfo>[] = [
  {
    id: "select",
    cell: ({ row }) => {
      return !row.original.usersId &&
        row.original._count.users < row.original.quantity ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      ) : null;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="flex items-center"
        >
          Tên khóa học
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    accessorKey: "title",
  },
  {
    accessorKey: "course_id",
    header: "Mã môn học",
  },
  {
    accessorKey: "schedule",
    header: "Tuần học",
  },
  {
    accessorKey: "date",
    header: "Ngày học",
  },
  {
    accessorKey: "time",
    header: "Giờ học",
  },
  {
    accessorKey: "_count",
    header: "Số lượng học viên",
    cell: ({ row }) => {
      return <p className="text-center">{row.original._count.users} / {row.original.quantity}</p>;
    },
  },
  {
    header: "Tình trạng",
    accessorKey: "usersId",
    cell: ({ row }) => {
      const usersId = row.getValue("usersId");
      return (
        <div className="font-medium">
          {row.original._count.users >= row.original.quantity
            ? "Hết chỗ"
            : usersId
              ? "Đã đăng ký"
              : "Chưa đăng ký"}
        </div>
      );
    },
  },
];
export const admin_columns: ColumnDef<StudentInfo>[] = [
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
    header: "No.",
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.avatar} alt="@shadcn" />
          <AvatarFallback>{row.original.firstname[0]}{row.original.lastname[0]}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    accessorKey: "firstname",
    header: "First name",
  },
  {
    accessorKey: "lastname",
    header: "Last name",
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of birth",
    cell: ({ row }) => {
      const date_of_birth = row.getValue("date_of_birth");
      const formatted = new Date(date_of_birth as string).toUTCString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      if (row.getIsSelected()) {
        return <Input type="text" className="font-medium" defaultValue={row.original.email} onChange={(e) => row.original.email = e.target.value}/>;
      } else {
        return <div className="font-medium">{row.original.email}</div>;
      }
    }
  },
]
