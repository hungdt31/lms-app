"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { SquareCheckBig, FileUp } from "lucide-react";
import Semester from "@/lib/axios/semester";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
const week = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
export default function ControlPage() {
  const [semester, setSemester] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [notice, setNotice] = useState<any>(null);
  const [name_filter, setNameFilter] = useState<any>("");
  const [date_filter, setDateFilter] = useState<any>("1");
  const [type_filter, setTypeFilter] = useState<any>("1");
  const token = new Cookies().get("token");
  const fetchSemesterByNow = async () => {
    const res = await Semester.GetSemesterByNow();
    setSemester(res?.data);
    // console.log(res);
  };
  const fetchSchedule = async (data: any) => {
    const res = await Semester.GetSchedule(data);
    setSchedule(res?.data);
    // console.log(res);
  };
  const fetchQuizAndSubmitTime = async (data: any) => {
    const res = await Semester.GetQuizAndSubmitTime(data);
    setNotice(res?.data);
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
    fetchQuizAndSubmitTime({
      id: semester?.id,
      token,
      name: name_filter,
      date: date_filter,
      type: type_filter,
    });
  }, [semester]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log({
      //   name_filter,
      //   date_filter,
      //   type_filter,
      // });
      fetchQuizAndSubmitTime({
        id: semester?.id,
        token,
        name: name_filter,
        date: date_filter,
        type: type_filter,
      });
    }, 500); // Delay of 0.5 second
  
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [name_filter, date_filter, type_filter]);
  return (
    <div className="gap-5 grid lg:grid-cols-2 grid-cols-1 lg:px-3">
      <div>
        <div className="mockup-browser border">
          <div className="mockup-browser-toolbar">
            <p className="font-bold ml-3 text-lg text-main dark:text-white">
              Mốc thời gian
            </p>
          </div>
          <div className="flex justify-center px-4 py-5">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center">
                <div className="flex gap-3 items-center pt-3 flex-wrap">
                  <Select
                    defaultValue="1"
                    onValueChange={(e) => setDateFilter(e)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Due</SelectLabel>
                        <SelectItem value="1">Hiện tại</SelectItem>
                        <SelectItem value="2">Next 7 days</SelectItem>
                        <SelectItem value="3">Next 30 days</SelectItem>
                        <SelectItem value="4">Next 60 days</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue="1"
                    onValueChange={(e) => setTypeFilter(e)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Sort by date</SelectItem>
                        <SelectItem value="2">Sort by course</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    className="ml-7"
                    placeholder="Search by activity name"
                    onChange={(e) => setNameFilter(e?.target?.value)}
                  />
                </div>
              </CardHeader>
              <Separator />
              <CardContent>
                {type_filter == "1" ? (
                  <div>
                    {notice?.map((item: any) => (
                      <div className="my-3">
                        <p className="font-bold">{item?.date}</p>
                        <div>
                          {item?.quiz?.map((el: any, index: number) => (
                            <div
                              className="flex gap-3 items-center p-3"
                              key={index}
                            >
                              <p className="font-mono">{el?.end_time}</p>
                              <div className="bg-rose-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
                                <SquareCheckBig className="dark:text-rose-500" />
                              </div>
                              <div>
                                <Link
                                  href={`/student/course/quiz?id=${el?.id}`}
                                >
                                  <Button
                                    variant={"link"}
                                    className="pl-0 text-base"
                                  >
                                    {el?.title}
                                  </Button>
                                </Link>
                                <p className="font-light text-sm">
                                  Trắc nghiệm kết thúc: {el?.course_title}(
                                  {el?.course_id})-{el?.course_teacher}
                                </p>
                              </div>
                            </div>
                          ))}
                          {item?.submissions?.map((el: any, index: number) => (
                            <div
                              className="flex gap-3 items-center p-3"
                              key={index}
                            >
                              <p className="font-mono">{el?.end_time}</p>
                              <div className="bg-orange-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
                                <FileUp className="dark:text-orange-500" />
                              </div>
                              <div>
                                <Link
                                  href={`/student/course/submission?id=${el?.id}`}
                                >
                                  <Button
                                    variant={"link"}
                                    className="pl-0 text-base"
                                  >
                                    {el?.title}
                                  </Button>
                                </Link>
                                <p className="font-light text-sm">
                                  Bài tập tới hạn: {el?.course_title}(
                                  {el?.course_id})-{el?.course_teacher}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {notice?.map((item: any) => (
                      <div className="my-3">
                        <p className="font-bold text-main dark:text-white text-lg mb-3">
                          [{item?.course_id}] {item?.title} -{" "}
                          {item?.course_teacher}
                        </p>
                        <div>
                          <div className="w-[100px] h-[3px] bg-main dark:bg-white mb-2"></div>
                          {item?.quiz?.map((el: any, index: number) => (
                            <div key={index}>
                              <p className="">{el?.date}</p>
                              {el?.quiz?.map((e: any, index: number) => (
                                <div className="flex gap-3 items-center p-3">
                                  <p className="font-mono">{e?.end_time}</p>
                                  <div className="bg-rose-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
                                    <SquareCheckBig className="dark:text-rose-500" />
                                  </div>
                                  <div>
                                    <Link
                                      href={`/student/course/quiz?id=${e?.id}`}
                                    >
                                      <Button
                                        variant={"link"}
                                        className="pl-0 text-base"
                                      >
                                        {e?.title}
                                      </Button>
                                    </Link>
                                    <p className="font-light text-sm">
                                      Trắc nghiệm kết thúc
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                          <div className="w-[100px] h-[3px] bg-main dark:bg-white mb-2"></div>
                          {item?.submissions?.map((el: any, index: number) => (
                            <div key={index}>
                              <p className="">{el?.date}</p>
                              {el?.submissions?.map((e: any, index: number) => (
                                <div className="flex gap-3 items-center p-3">
                                  <p className="font-mono">{e?.end_time}</p>
                                  <div className="bg-orange-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
                                    <FileUp className="dark:text-orange-500" />
                                  </div>
                                  <div>
                                    <Link
                                      href={`/student/course/submission?id=${e?.id}`}
                                    >
                                      <Button
                                        variant={"link"}
                                        className="pl-0 text-base"
                                      >
                                        {e?.title}
                                      </Button>
                                    </Link>
                                    <p className="font-light text-sm">
                                      Bài nộp tới hạn
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
              <li>
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
                    schedule?.schedule[index]?.map((item: any) => (
                      <div className="text-sm">
                        <div className="text-lg font-black">{item?.title}</div>
                        <span>{item?.time}</span>
                      </div>
                    ))}
                </div>
                <hr />
              </li>
            ) : (
              <li>
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
                    schedule?.schedule[index]?.map((item: any) => (
                      <div className="text-sm">
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
