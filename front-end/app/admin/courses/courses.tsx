"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DataTable } from "./data-table";
import { Course, columns } from "./columns";

import { fetch_all_course } from "@/features/course/CourseSlice";
import { IoIosBookmarks } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminCoursePage() {
  const courses = useSelector((state: any) => state.course);
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(fetch_all_course());
  }, []);

  return (
    <div className="py-5">
      <div className="flex gap-7 m-auto flex-col mt-[40px]">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex gap-3 items-center font-bold underline ">
            <IoIosBookmarks size={24} />
            <p>COURSE</p>
          </div>
          <div className="flex justify-end">
            <Link href="/admin/courses/add">
              <Button variant="outline" className="rounded-full">
                Add Course <FaPlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <DataTable columns={columns} data={courses.data.course} />
      </div>
    </div>
  );
}
