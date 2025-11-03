"use client";
import Quiz from "@/lib/axios/quiz";
import { Check, X, SquareCheckBig } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import TimeConvert from "@/helpers/TimeConvert";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import UserQuery from "@/hooks/user";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { QuizQuery } from "@/hooks/quiz";
import Link from "next/link";
import BreadcrumbNav from "./breadcrumb";
export default function Page() {
  const token = new Cookies().get("token");
  const [isAttend, setIsAttend] = useState<boolean>(true);
  const [quizUser, setQuizUser] = useState<any>(null);
  const [time, setTime] = useState<any>(0);
  const router = useRouter();
  const user = UserQuery();
  const [quiz, setQuiz] = useState<any>(null);
  const id: string = useSearchParams().get("id") as string;
  const { data, isPending, error } = QuizQuery(id);

  const fetchQuizPlay = async () => {
    const quiz = await Quiz.GetQuizPlay(id, user?.data?.data?.id);
    setTime(quiz?.data?.timeEnded);
    const timeEnded = new Date(quiz?.data?.timeEnded).getTime();

    const now = Date.now();

    let difference: any = timeEnded - now;
    // console.log(difference);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    difference -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(difference / (1000 * 60 * 60));
    difference -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(difference / (1000 * 60));
    difference -= minutes * (1000 * 60);

    const seconds = Math.floor(difference / 1000);

    setTime({ days, hours, minutes, seconds });
    setQuiz(quiz?.data);
  };

  useEffect(() => {
    fetchQuizPlay();

    const intervalId = setInterval(() => {
      if (quiz) {
        const timeEnded = new Date(quiz.timeEnded).getTime();
        const now = Date.now();
        console.log(timeEnded - now);
        if (timeEnded - now <= 0) {
          setQuiz(null);
          setTime(null);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [quiz]);

  const fetchQuiz = async () => {
    const q: any = await Quiz.GetQuizByUser({ id, token });
    console.log(q);
    setQuizUser(q?.data);
  };
  useEffect(() => {
    fetchQuiz();
  }, []);
  if (isPending)
    return (
      <div className="pb-16">
        <BreadcrumbNav />
        <div className="flex justify-center pb-5">
          <div className="p-5 flex flex-col gap-5 lg:w-[60%] w-[90%]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-1 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="mt-4 h-16 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-6 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="rounded-md border">
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-50 dark:bg-gray-900 border-t animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <div>{"Something're wrong !"}</div>;
  return (
    <div className="pb-16">
      <BreadcrumbNav />
      <div className="flex justify-center pb-5">
        <div className="p-5 flex flex-col gap-5 rounded-xl shadow-sm lg:w-[60%] w-[90%]">
          <h1 className="font-bold text-2xl flex items-center gap-3 text-primary">
            <div className="w-[50px] h-[50px] flex justify-center items-center bg-primary text-primary-foreground rounded-xl">
              <SquareCheckBig />
            </div>
            <div>
              <p className="leading-tight">{data?.data?.title}</p>
              <div className="h-1 w-20 bg-primary rounded mt-1" />
            </div>
          </h1>
          <Card className="rounded-xl">
            <CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CardDescription>
                  <p>
                    <strong>Opened:</strong> {TimeConvert(data?.data?.start_date)}
                  </p>
                </CardDescription>
                <CardDescription>
                  <p>
                    <strong>Closed:</strong> {TimeConvert(data?.data?.end_date)}
                  </p>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{quizUser?.description}</p>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <p>
              <strong className="font-light">Attempts allowed: </strong>
              {data?.data?.attempts ? data?.data?.attempts : "không giới hạn"}
            </p>
            <p>
              <strong className="font-light">Thời gian làm bài: </strong>
              {Number(data?.data?.time_limit) / 60000} phút
            </p>
            <p>
              <strong className="font-light">Cách tính điểm: </strong>
              {data?.data?.typePoint}
            </p>
          </div>
          {time &&
          !isNaN(time.hours) &&
          !isNaN(time.minutes) &&
          !isNaN(time.seconds) ? (
            <p>
              {String(time.hours).padStart(2, "0")}:
              {String(time.minutes).padStart(2, "0")}:
              {String(time.seconds).padStart(2, "0")}
            </p>
          ) : (
            ""
          )}
          <p className="text-cyan-500 text-xl">
            Tổng quan các lần làm bài trước của bạn
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Làm lại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm / 10,00</TableHead>
                <TableHead>Xem lại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizUser?.history?.length ? quizUser?.history?.map((el: any, index: any) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {el.isDone ? (
                        <div>
                          <p>Đã xong</p>
                          <p className="text-gray-500 text-[12px]">
                            Đã nộp {TimeConvert(el.timeFinished)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p>Chưa hoàn thành</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{el?.score}</TableCell>
                    <TableCell className="text-left">
                      {el.isDone ? (
                        <Button
                          variant={"secondary"}
                          onClick={() =>
                            router.push(
                              `/student/course/quiz/result?id=${el.id}`,
                            )
                          }
                        >
                          <Check />
                        </Button>
                      ) : (
                        <X />
                      )}
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Chưa có lịch sử làm bài
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {quiz ? (
              <Button
                onClick={() => {
                  router.push(`/student/course/quiz/play?id=${id}`);
                }}
                className="min-w-[100px]"
              >
                Tiếp tục làm bài
              </Button>
            ) : (
              isAttend && (
              <Button
                onClick={async () => {
                  const rs: any = await Quiz.StartQuiz(
                    id,
                    user?.data?.data?.id,
                  );
                  console.log(rs);
                  if (!rs?.success) setIsAttend(false);
                  else router.push(`/student/course/quiz/play?id=${id}`);
                  console.log(rs);
                }}
                className="min-w-[100px]"
              >
                Bắt đầu
              </Button>
              )
            )}
            {isAttend ? <p></p> : (
              <p className="text-sm text-muted-foreground">Quiz đã hết hạn hoặc chưa mở</p>
            )}

            <p className="text-center font-bold text-xl">
              Điểm cuối cùng:{" "}
              <Button variant={"ghost"} className="text-xl">
                {quizUser?.total_score}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
