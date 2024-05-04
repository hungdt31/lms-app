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
export default function DetailCourse({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const id: string = useSearchParams().get("id") as string;
  const { data } = CourseQuery(id);
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
      href: `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail?id=${id}`,
    },
    {
      icon: <Users />,
      title: "Lớp học",
      href: `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail/attendance?id=${id}`,
    },
  ];
  return (
    <div className="flex gap-7 p-5 relative sm:flex-row flex-col">
      {active.open && (
        <div className="flex flex-col gap-3 absolute top-0 left-0 z-50 p-3">
          {LeftNav.map((el: any, _index: any) => {
            return (
              <Link
                href={el.href}
                onClick={() => setIndex(_index)}
                key={_index}
              >
                {_index === index ? (
                  <Button className="flex items-center gap-3 animate-slide-right">
                    {el.icon}
                    <p>{el.title}</p>
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-3 animate-slide-right"
                    variant={"outline"}
                  >
                    {el.icon}
                    <p>{el.title}</p>
                  </Button>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div className="sm:w-1/4 relative min-w-[200px]">
        <div className="relative">
          <img src={data?.data?.image} alt="..." className="rounded-xl" />
          <div className="absolute top-[50%] -left-2 z-50">
            <Button
              onClick={() => {
                setActive({
                  icon: active.open ? <ChevronRight /> : <ChevronLeft />,
                  open: !active.open,
                });
              }}
            >
              {active.icon}
            </Button>
          </div>
        </div>
        <h1 className="font-bold text-xl p-5 text-center">
          {data?.data?.title} - {data?.data?.course_id}
        </h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold">
              Lịch dạy học
            </AccordionTrigger>
            <AccordionContent>
              <p>Tuần học: [{data?.data?.schedule.join(", ")}]</p>
              <p>Ngày trong tuần: {data?.data?.date}</p>
              <p>Thời gian: {data?.data?.time}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-bold">
              Thông tin khác
            </AccordionTrigger>
            <AccordionContent>
              <p>Số tín chỉ: {data?.data?.credit}</p>
              <p>
                Tham gia: {data?.data?.usersId?.length} / {data?.data?.quantity}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <blockquote className="mt-6 border-l-2 pl-6 italic border-nav-text shadow-md py-3">
          &quot; {data?.data?.description} &quot;
        </blockquote>
      </div>
      {children}
    </div>
  );
}
