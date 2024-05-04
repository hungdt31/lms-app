"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Post from "@/lib/axios/post";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const Nav = [
  "/student/course/detail?",
  "/student/course/forum?",
  "/student/course/forum/thread?",
];
export default function BreadcrumbNav() {
  const id: string = useSearchParams().get("id") as string;
  const [data, setData] = useState<any>(null);
  const fetchData = async () => {
    const data = await Post.GetThreadBreadcum(id);
    setData(data?.data);
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  return (
    <Breadcrumb className="pl-11 pb-7">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/student/my">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {data?.map((el: any, index: any) => (
          <div key={index}>
            <BreadcrumbItem key={index} className="flex gap-3 items-center">
              <BreadcrumbSeparator />
              <BreadcrumbLink
                href={
                  index == 0
                    ? Nav[index] + `id=${el?.id}&index=0`
                    : Nav[index] + `id=${el?.id}`
                }
              >
                {el?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
