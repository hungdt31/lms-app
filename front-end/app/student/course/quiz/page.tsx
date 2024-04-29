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
  if (isPending) return <div>Loading ....</div>;
  if (error) return <div>Something're wrong !</div>;
  return (
    <div>
      <BreadcrumbNav />
      <div className="flex justify-center pb-5">
        <div className="p-5 flex flex-col gap-5 border-2 shadow-lg lg:w-[70%] rounded-md w-[80%]">
          <h1 className="font-bold text-2xl flex items-center gap-3 text-rose-700">
            <div className="w-[50px] h-[50px] flex justify-center items-center dark:bg-black bg-rose-700 text-white dark:text-rose-700 rounded-lg">
              <SquareCheckBig />
            </div>
            <p>{data?.data?.title}</p>
          </h1>
          <Card className="">
            <CardHeader>
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
            </CardHeader>
            <CardContent>
              <p>{quizUser?.description}</p>
            </CardContent>
          </Card>
          <p className="flex flex-col gap-2">
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
          </p>
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
              {quizUser?.history?.map((el: any, index: any) => {
                return (
                  <TableRow>
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
              })}
            </TableBody>
          </Table>
          <div className="flex justify-around">
            {quiz ? (
              <Button
                onClick={() => {
                  router.push(`/student/course/quiz/play?id=${id}`);
                }}
                className="min-w-[100px]"
              >
                Tiến tục làm bài
              </Button>
            ) : (
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
            )}
            {isAttend ? <p></p> : <p>Quiz đã hết hạn hoặc chưa mở</p>}

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
