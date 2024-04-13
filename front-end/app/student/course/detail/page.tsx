"use client";
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
export default function DetailCourse() {
  const id: string = useSearchParams().get("id") as string;
  const { data } = CourseQuery(id);
  return (
    <div>
      <p>{data?.mess}</p>
    </div>
  );
}
