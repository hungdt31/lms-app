"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { FastForward } from "lucide-react";
import SemesterQuery from "@/hooks/semester";
import { Button } from "@/components/ui/button";
import UserQuery from "@/hooks/user";
export default function TeacherPage() {
  const mutation = CourseFilterQuery();
  const { data } = SemesterQuery();
  const [info, setInfo] = useState<any>(null);
  const user = UserQuery();
  // console.log(mutation);
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex gap-5 items-center mt-5">
        <Select
          onValueChange={(el: any) => {
            setInfo(el);
            mutation.mutate({ semesterId: el?.id , userId : user?.data?.data?.id});
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((el: any) => {
              return <SelectItem value={el}>{el?.description}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        {info && (
          <div className="flex gap-4">
            <p>{TimeConvert(info?.start_date)}</p>
            <FastForward />
            <p>{TimeConvert(info?.end_date)}</p>
          </div>
        )}
      </div>
      {mutation.isPending && <BlockLoading />}
      {mutation.isError && <p>Something is not good ..</p>}
      {mutation.isSuccess && (
        <div className="flex flex-wrap gap-5 mt-3">
          {mutation.data?.data?.map((el: any) => {
            return (
              <div className="card w-96 bg-base-100 shadow-xl image-full ">
                <figure>
                  <img src={el?.image} alt="....." />
                </figure>
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <Layers />
                    <h2 className="card-title">{el?.title}</h2>
                  </div>
                  <p>{el?.course_id}</p>
                  <div className="card-actions justify-end">
                    <Link href={`/teacher/course/detail?id=${el?.id}`}>
                    <Button>Detail</Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}