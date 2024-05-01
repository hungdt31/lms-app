import { ColumnDef } from "@tanstack/react-table";
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

export type Course = {
  id: string;
  title: string;
  status: "pending" | "processing" | "success" | "failed";
  course_id: string;
  description: string;
  image: string;
  fetchCourse: (id: any) => void;
  fetId: any;
};

export const columns = (
  fetchCourse: Course["fetchCourse"],
  fetId: Course["fetId"],
): ColumnDef<Course>[] => [
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
    accessorKey: "title",
    cell: ({ row }) => {
      return <></>;
    },
  },
  {
    accessorKey: "course_id",
    cell: () => {
      return <></>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const token = new Cookies().get("token");
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
            <DropdownMenuItem
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
                    await Course.DeleteCourseByAdmin(id, token).then(
                      (res: any) => {
                        if (res?.success) {
                          fetchCourse(fetId);
                          Swal.fire("Saved!", res?.mess, "success");
                        } else {
                          Swal.fire("Error!", "Something went wrong!", "error");
                        }
                      },
                    );
                  } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                  }
                });
              }}
            >
              Delete course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
