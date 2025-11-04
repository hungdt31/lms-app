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

// Utility function để format date nhất quán, tránh hydration mismatch
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    // Sử dụng UTC methods để đảm bảo nhất quán giữa server và client
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "-";
  }
};
export type UserInfo = {
  id: string;
  mssv: string,
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  email: string;
  phone: string;
  result: {
    average_score: number;
    score_array: Array<number>;
  }
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
  mssv: string;
  avatar: string;
  firstname: string;
  lastname: string;
  email: string
};
export type ThreadInfo = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
export type QuizInfo = {
  id: string;
  mssv: string;
  name: string;
  score_list: Array<number>;
  final_score: string
};
export const columns: ColumnDef<UserInfo>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => {
  //     return (
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(value) => {
  //           table.toggleAllPageRowsSelected(!!value);
  //         }}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => {
  //           row.toggleSelected(!!value);
  //         }}
  //       />
  //     );
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "mssv",
    header: "MSSV",
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
      const formatted = formatDate(date_of_birth as string);
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
    accessorKey: "result.score_array",
    header: "Score array",
    cell: ({ row }) => {
      return <div className="font-medium">[{row?.original?.result?.score_array?.join(", ")}]</div>;
    },
  },
  {
    accessorKey: "result.average_score",
    header: ({ column }) => {
      return (
        <div
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="flex items-center"
        >
          Average score
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
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
      const formatted = formatDate(date_of_birth as string);
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
// Columns riêng cho student, có thêm cột MSSV
export const student_columns: ColumnDef<StudentInfo>[] = [
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
    accessorKey: "mssv",
    header: "MSSV",
    cell: ({ row }) => {
      if (row.getIsSelected()) {
        return <Input type="text" className="font-medium" defaultValue={row.original.mssv} onChange={(e) => row.original.mssv = e.target.value}/>;
      } else {
        return <div className="font-medium">{row.original.mssv || "-"}</div>;
      }
    }
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
      const formatted = formatDate(date_of_birth as string);
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
export const thread_columns: ColumnDef<ThreadInfo>[] = [
  {
    header: "No.",
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const router = useRouter();
      const thread = row.original as any;
      return (
        <button
          className="text-primary hover:underline"
          onClick={() => router.push(`/student/course/forum/thread?id=${thread.id}`)}
        >
          {thread.title}
        </button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Created At
          <ArrowUpDown className="ml-3 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      const formatted = new Date(createdAt as string).toUTCString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Updated At
          <ArrowUpDown className="ml-3 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt");
      const formatted = new Date(updatedAt as string).toUTCString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const thread = row.original;
      const threadId = thread.id;
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
                router.push(
                  `/student/course/forum/thread?id=${threadId}`,
                );
              }}
            >
              Go to detail thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const quiz_columns: ColumnDef<QuizInfo>[] = [
  {
    header: "No.",
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "mssv",
    header: "MSSV",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-mono">{row.original.name}</div>;
    }
  },
  {
    accessorKey: "score_list",
    header: "Score list",
    cell: ({ row }) => {
      return <div className="font-medium">[{row.original.score_list?.join(", ")}]</div>;
    }
  },
  {
    accessorKey: "final_score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Final score
          <ArrowUpDown className="ml-3 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-bold">{row.original.final_score}</div>;
    }
  },
];
