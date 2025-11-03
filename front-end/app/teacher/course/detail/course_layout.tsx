"use client";
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
import { ChevronLeft, ChevronRight, BookText, Users } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
export default function DetailCourse({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const id: string = useSearchParams().get("id") as string;
  const { data, isLoading } = CourseQuery(id);
  const [index, setIndex] = useState<number>(0);
  const [active, setActive] = useState<isOpen>({
    icon: <ChevronLeft />,
    open: true,
  });
  type isOpen = {
    icon: any;
    open: boolean;
  };
  const LeftNav = [
    {
      icon: <BookText />,
      title: "Tài liệu",
      href: `/teacher/course/detail?id=${id}`,
    },
    {
      icon: <Users />,
      title: "Lớp học",
      href: `/teacher/course/detail/attendance?id=${id}`,
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname?.includes("attendance") ? "class" : "docs";
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:flex-row flex-col flex gap-7">
      {active.open && (
        <div className="sm:w-1/4 w-full min-w-[220px] space-y-4 sm:sticky sm:top-4 sm:self-start">
          <div className="rounded-xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="h-48 w-full rounded-xl bg-muted animate-pulse" />
            ) : (
              <img src={data?.data?.image} alt="Course cover" className="h-48 w-full object-cover" />
            )}
          </div>
          <Tabs defaultValue={currentTab} onValueChange={(v) => {
            if (v === "docs") router.push(LeftNav[0].href);
            if (v === "class") router.push(LeftNav[1].href);
          }}>
            <TabsList className="w-full grid grid-cols-2 bg-transparent p-0">
              <TabsTrigger
                value="docs"
                className="gap-2 px-4 py-2 w-full justify-center border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
              >
                <BookText /> <span>Tài liệu</span>
              </TabsTrigger>
              <TabsTrigger
                value="class"
                className="gap-2 px-4 py-2 w-full justify-center border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
              >
                <Users /> <span>Lớp học</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {isLoading ? (
            <>
              <div className="mx-auto mt-3 h-6 w-40 rounded bg-muted animate-pulse" />
              <div className="mx-auto mt-2 h-4 w-24 rounded bg-muted/70 animate-pulse" />
            </>
          ) : (
            <>
              <h1 className="font-bold text-xl text-center mt-2">{data?.data?.title}</h1>
              <p className="text-center text-sm text-muted-foreground">{data?.data?.course_id}</p>
            </>
          )}
          <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold">
              Lịch dạy học
            </AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <p>Tuần học: [{data?.data?.schedule.join(", ")}]</p>
                  <p>Ngày trong tuần: {data?.data?.date}</p>
                  <p>Thời gian: {data?.data?.time}</p>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-bold">
              Thông tin khác
            </AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <p>Số tín chỉ: {data?.data?.credit}</p>
                  <p>
                    Tham gia: {data?.data?.usersId?.length} / {data?.data?.quantity}
                  </p>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
          {isLoading ? (
            <div className="mt-4 h-12 w-full rounded bg-muted/60 animate-pulse" />
          ) : (
            <blockquote className="mt-4 border-l-2 pl-4 italic border-nav-text text-sm text-muted-foreground">
              &quot; {data?.data?.description} &quot;
            </blockquote>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 w-56 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-8 w-40 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted/60 rounded animate-pulse" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

