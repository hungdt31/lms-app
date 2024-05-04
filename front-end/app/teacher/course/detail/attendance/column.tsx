import { ColumnDef } from "@tanstack/react-table";
import TimeConvert from "@/helpers/TimeConvert";
import { CalendarIcon } from "@radix-ui/react-icons";
import Swal from "sweetalert2";
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
import { Checkbox } from "@/components/ui/checkbox";
export type Thread = {
  title: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  last_updated_at: string;
  lastest_user: {
    createdAt: string;
    username: string;
    avatar: string;
  };
};

export const columns: ColumnDef<Thread>[] = [
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
    accessorKey: "Avatar",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <img
          src={
            row.original?.lastest_user?.avatar ||
            "https://github.com/vercel.png"
          }
          className="w-24 lg:w-32 rounded-md object-center"
        />
      );
    },
  },
  {
    accessorKey: "Thread",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{row.original.title}</h4>
          <p className="text-sm">
            {row.original?.lastest_user?.username} –{" "}
            {TimeConvert(row.original?.last_updated_at)}.
          </p>
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined {TimeConvert(row.original.createdAt)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    cell: ({ row }) => {
      return <></>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const id = row.original.id;
  //     const token = new Cookies().get("token");
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreVertical className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem>
  //             <Link
  //               href={{
  //                 pathname: "/admin/courses/edit",
  //                 query: { id: id },
  //               }}
  //             >
  //               Edit course
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               Swal.fire({
  //                 title: "Do you want to save the changes?",
  //                 showDenyButton: true,
  //                 showCancelButton: true,
  //                 confirmButtonText: "Save",
  //                 denyButtonText: `Don't save`,
  //               }).then(async (result) => {
  //                 /* Read more about isConfirmed, isDenied below */
  //                 if (result.isConfirmed) {
  //                   await Course.DeleteCourseByAdmin(id, token).then(
  //                     (res: any) => {
  //                       if (res?.success) {
  //                         fetchCourse(fetId);
  //                         Swal.fire("Saved!", res?.mess, "success");
  //                       } else {
  //                         Swal.fire("Error!", "Something went wrong!", "error");
  //                       }
  //                     },
  //                   );
  //                 } else if (result.isDenied) {
  //                   Swal.fire("Changes are not saved", "", "info");
  //                 }
  //               });
  //             }}
  //           >
  //             Delete course
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
