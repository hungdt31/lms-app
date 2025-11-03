"use client";
import Semester from "@/lib/axios/semester";
import { useEffect, useMemo, useState } from "react";
import Cookies from "universal-cookie";
import TimeConvert from "@/helpers/TimeConvert";
import DataTable from "@/components/student/DataTable";
import { SearchX } from "lucide-react";
import { semester_columns } from "@/helpers/Column";
import { BlockLoading } from "@/components/loading";
export default function Page() {
  const [dkmh, setDkmh] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token: string = useMemo(() => new Cookies().get("token") as string, []);
  const fetchCourseSemester = async () => {
    setLoading(true);
    try {
      const semester = await Semester.GetDkmhSemester(token);
      setDkmh(semester?.data ?? null);
    } catch (_e) {
      setDkmh(null);
    } finally {
      setLoading(false);
    }
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
      {loading ? (
        <div className="w-full py-16 flex items-center justify-center">
          <BlockLoading />
        </div>
      ) : dkmh?.semester?.courses && dkmh?.semester?.courses?.length > 0 ? (
        <div className="flex justify-center lg:mx-0 mx-3">
          <DataTable
            columns={semester_columns}
            data={dkmh?.semester?.courses}
            fetch={fetchCourseSemester}
          />
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center text-muted-foreground">
          <SearchX className="h-8 w-8 mb-2" />
          <p className="font-medium">Không có dữ liệu đăng ký môn học</p>
        </div>
      )}
    </div>
  );
}
