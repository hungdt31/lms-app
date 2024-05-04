"use client";
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
import DocSection from "@/components/teacher/DocSection";
import VideoSection from "@/components/teacher/VideoSection";
export default function Docs() {
  const id: string = useSearchParams().get("id") as string;
  const qr = CourseQuery(id);
  //console.log(qr);
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
      <DocSection qr={qr} />
      <VideoSection qr={qr} />
    </div>
  );
}
