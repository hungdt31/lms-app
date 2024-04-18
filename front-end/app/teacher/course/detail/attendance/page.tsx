"use client";
import { columns } from "@/helpers/Column"
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
import Cookies from "universal-cookie";

import { useEffect, useState } from "react";
import { ListUserQuery } from "@/hooks/user";
import DataTable from "@/components/teacher/DataTable";
export default function Attendance() {
  const mutation = ListUserQuery();
  const token = new Cookies().get("token");
  const id: string = useSearchParams().get("id") as string;
  const { data } = CourseQuery(id);

  useEffect(() => {
    mutation.mutate({ token, id: data?.data?.id });
  }, [data]);
  // console.log(mutation)
  return (
    <div>
      {mutation?.data?.data && <DataTable columns={columns} data={mutation?.data?.data} /> }
    </div>
  );
}
