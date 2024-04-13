"use client"
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
export default function Attendance() {
  const id: string = useSearchParams().get("id") as string;
  const { data } = CourseQuery(id);
  console.log(data)
  return (
    <div>
      {data?.data?.title}
    </div>
  )
}