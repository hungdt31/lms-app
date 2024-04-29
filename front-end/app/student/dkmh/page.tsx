"use client";
import Semester from "@/lib/axios/semester";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import TimeConvert from "@/helpers/TimeConvert";
import DataTable from "@/components/student/DataTable";
import { semester_columns } from "@/helpers/Column";
export default function Page() {
  const [dkmh, setDkmh] = useState<any>(null);
  const token: string = new Cookies().get("token") as string;
  const fetchCourseSemester = async () => {
    const semester = await Semester.GetDkmhSemester(token);
    setDkmh(semester?.data);
    // console.log(semester?.data);
  };
  useEffect(() => {
    fetchCourseSemester();
  }, []);
  return (
    <div>
      {dkmh && (
        <div className="flex justify-center">
          <div role="alert" className="alert alert-info lg:w-[60%] mx-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p className="font-bold">Đợt đăng ký môn học đã mở.</p>
              <p>
                Thời gian: {TimeConvert(dkmh?.start_date)} -{" "}
                {TimeConvert(dkmh?.end_date)}
              </p>
            </div>
          </div>
        </div>
      )}
      {dkmh && (
        <div className="flex justify-center lg:mx-0 mx-3">
          <DataTable
            columns={semester_columns}
            data={dkmh?.semester?.courses}
            fetch={fetchCourseSemester}
          />
        </div>
      )}
    </div>
  );
}
