"use client";
import "./styles.css";
import { SquareCheckBig, FileUp } from "lucide-react";
import Semester from "@/lib/axios/semester";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Button } from "@/components/ui/button";
const week = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
export default function ControlPage() {
  const [tkb, setTkb] = useState<any>(null);
  const [semester, setSemester] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const token = new Cookies().get("token");
  const fetchSemesterByNow = async () => {
    const res = await Semester.GetSemesterByNow();
    setSemester(res?.data);
    // console.log(res);
  };
  const fetchTKB = async (id: any) => {
    const rs: any = await Semester.GetTKB({ id, token });
    setTkb(rs?.data);
    console.log(rs?.data);
  };
  const fetchSchedule = async (data: any) => {
    const res = await Semester.GetSchedule(data);
    setSchedule(res?.data);
    // console.log(res);
  };
  useEffect(() => {
    fetchSemesterByNow();
  }, []);
  useEffect(() => {
    fetchSchedule({
      id: semester?.id,
      token,
    });
    fetchTKB(semester?.id);
  }, [semester]);
  return (
    <div className="gap-5 grid lg:grid-cols-2 grid-cols-1 lg:px-3 p-5">
      <div className="flex justify-center items-center flex-col">
        <p className="font-bold text-2xl mb-5">
          Thời khóa biểu {semester?.description}
        </p>
        <div className="overflow-x-auto rounded-lg shadow-sm border-l-2 border-r-2 border-nav">
          <table className="table table-sm table-pin-rows table-pin-cols text-lg ">
            <thead>
              <tr>
                <td></td>
                <td>Môn học</td>
                <td>Số tín chỉ</td>
                <td>Tuần học</td>
                <td>Giờ học</td>
              </tr>
            </thead>
            <tbody>
              {tkb?.map((el: any, index: any) => {
                if (el?.length === 0) {
                  return (
                    <tr key={index}>
                      <td colSpan={5} className="font-bold">
                        {week[index]}
                      </td>
                    </tr>
                  );
                } else {
                  return el?.map((e: any, i: number) => {
                    return (
                      <tr key={`${index}-${i}`}>
                        {i === 0 && (
                          <td
                            rowSpan={el.length}
                            className="border-r-2 font-bold border-nav"
                          >
                            {week[index]}
                          </td>
                        )}
                        <td className="border-r-2 border-nav">
                          {e?.title} ({e?.course_id})
                        </td>
                        <td className="border-r-2 border-nav">{e?.credit}</td>
                        <td className="border-r-2 border-nav">
                          {e?.schedule.join(", ")}
                        </td>
                        <td>{e?.time}</td>
                      </tr>
                    );
                  });
                }
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center pb-5">
        <p>
          <strong>Tuần học hiện tại:</strong> {schedule?.index} -{" "}
          {semester?.description}
        </p>
        <p>Hôm nay : {schedule?.now}</p>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {Array.from({ length: 6 }).map((_, index: number) =>
            index % 2 === 0 ? (
              <li key={index}>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={
                      week[index] == schedule?.now.split(",")[0]
                        ? `h-5 w-5 text-primary`
                        : `h-5 w-5`
                    }
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <Button>
                    <time className="font-mono italic text-lg">
                      {week[index]}
                    </time>
                  </Button>

                  {schedule?.schedule &&
                    schedule?.schedule[index]?.map((item: any, _index: any) => (
                      <div className="text-sm" key={_index}>
                        <div className="text-lg font-black">{item?.title}</div>
                        <span>{item?.time}</span>
                      </div>
                    ))}
                </div>
                <hr />
              </li>
            ) : (
              <li key={index}>
                <hr />
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={
                      week[index] == schedule?.now.split(",")[0]
                        ? `h-5 w-5 text-primary`
                        : `h-5 w-5`
                    }
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end mb-10">
                  <Button>
                    <time className="font-mono italic text-lg">
                      {week[index]}
                    </time>
                  </Button>
                  {schedule?.schedule &&
                    schedule?.schedule[index]?.map((item: any, index: any) => (
                      <div className="text-sm" key={index}>
                        <div className="text-lg font-black">{item?.title}</div>
                        <span>{item?.time}</span>
                      </div>
                    ))}
                </div>
                <hr />
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
