"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import TimeConvert from "@/helpers/TimeConvert";
import { CourseFilterQuery } from "@/hooks/course";
import { Layers } from "lucide-react";
import { BlockLoading } from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SemesterQuery from "@/hooks/semester";
import { Button } from "@/components/ui/button";
import UserQuery from "@/hooks/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CardStackIcon } from "@radix-ui/react-icons";
export default function TeacherPage() {
  const mutation = CourseFilterQuery();
  const [notice, setNotice] = useState<any>(null);
  const { data } = SemesterQuery();
  const [info, setInfo] = useState<any>(null);
  const user = UserQuery();
  // console.log(mutation);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      <div className="flex gap-5 items-center justify-center mt-6 lg:flex-row flex-col">
        <Select
          onValueChange={(el: any) => {
            setInfo(el);
            mutation.mutate({
              semesterId: el?.id,
              userId: user?.data?.data?.id,
            });
          }}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((el: any, index: any) => {
              return (
                <SelectItem value={el} key={index}>
                  {el?.description}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {info && (
          <div className="flex gap-3 sm:flex-row flex-col mb-3 sm:mb-0 items-center text-sm">
            From
            <Button variant={"secondary"}>{TimeConvert(info?.start_date)}</Button>
            to
            <Button variant={"secondary"}>{TimeConvert(info?.end_date)}</Button>
          </div>
        )}
      </div>
      <Card className="w-full rounded-xl shadow-sm mt-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2">
            <Layers className="h-4 w-4" />
            <span className="font-semibold">Khóa học</span>
            <Badge variant="secondary">{mutation.data?.data?.length ?? 0}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mutation.isPending && <BlockLoading />}
          {mutation.isError && <p className="text-sm text-red-500">Có lỗi xảy ra. Vui lòng thử lại.</p>}
          {mutation.isSuccess && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2">
              {mutation.data?.data?.length ? (
                mutation.data?.data?.map((el: any, index: any) => (
                  <Link href={`/teacher/course/detail?id=${el?.id}`} key={index}>
                    <div className="relative overflow-hidden rounded-xl shadow-sm group">
                      <img src={el?.image} alt={el?.title} className="h-48 w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg truncate">{el?.title}</h3>
                        <p className="text-sm opacity-80">{el?.course_id}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Chưa có khóa học trong học kỳ này
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
