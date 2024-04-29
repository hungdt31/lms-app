"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import Quiz from "@/lib/axios/quiz";
import { CircleCheckBig, CircleMinus, CircleX, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BreadcrumbNav from "../breadcrumb";
function secondsToHMS(seconds: any) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  let formattedHours = hours < 10 ? "0" + hours : hours;
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}
export default function ResultPage() {
  const id: string = useSearchParams().get("id") as string;
  const [history, setHistory] = useState<any>(null);
  const fetchData = async () => {
    const rs = await Quiz.GetHistoryPlayQuiz(id);
    console.log(rs);
    setHistory(rs?.data);
  };
  //console.log(data);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <BreadcrumbNav/>
      <div className="flex justify-around sm:flex-row flex-col gap-3 items-center px-2">
        <Card className="min-w-[350px]">
          <CardHeader>
            <CardTitle>Kết quả làm bài</CardTitle>
            <CardDescription className="hover:underline">
              Quiz: {history?.quizResult?.quiz?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Điểm thi: <strong>{history?.score}</strong>
            </p>
            <p>
              Độ chính xác (#đúng/#tổng):{" "}
              <strong>
                {Number(
                  (history?.correct * 100) /
                    (history?.correct + history?.incorrect + history?.empty),
                ).toFixed(0)}
                %{" "}
              </strong>
            </p>
            Thời gian hoàn thành:{" "}
            {secondsToHMS(
              Math.floor(
                (new Date(history?.timeFinished).getTime() -
                  new Date(history?.timeStarted).getTime()) /
                  1000,
              ),
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <div className="bg-background grid grid-cols-3 shadow-lg rounded-l-lg rounded-r-lg border-2">
          <div className="p-7 items-center flex flex-col gap-3 border-r-2">
            <CircleCheckBig color="green" />
            <div className="font-bold text-green-700 text-xl text-center">
              Trả lời đúng
            </div>
            <div className="text-center font-bold text-xl">
              {history?.correct}
            </div>
            <div>↗Câu hỏi</div>
          </div>

          <div className="p-7 items-center flex flex-col gap-3 border-r-2">
            <CircleX color="red" />
            <div className="font-bold text-red-700 text-xl text-center">
              Trả lời sai
            </div>
            <div className="text-center font-bold text-xl">
              {history?.incorrect}
            </div>
            <div>↗Câu hỏi</div>
          </div>

          <div className="p-7 items-center flex flex-col gap-3">
            <CircleMinus color="gray" />
            <div className="font-bold text-gray-700 text-xl text-center">
              Bỏ qua
            </div>
            <div className="text-center font-bold text-xl">
              {history?.empty}
            </div>
            <div>↗Câu hỏi</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[80%]">
          <p className="font-bold text-xl m-5">Phân tích chi tiết</p>
          <div className="grid lg:grid-cols-3 m-5 gap-3 sm:grid-cols-2 grid-cols-1">
            {history?.quizResult?.quiz.questions?.map((el: any, index: any) => {
              return (
                <div key={index}>
                  <div className="flex gap-3 items-center">
                    <Button className="rounded-full" variant={"secondary"}>
                      {index + 1}
                    </Button>
                    <p>{el?.answer}</p>
                    <p
                      className={
                        el?.answer == history?.answers[index]
                          ? ""
                          : "line-through"
                      }
                    >
                      {history?.answers[index]}
                    </p>
                    {el?.answer == history?.answers[index] ? (
                      <Check color="green" />
                    ) : (
                      <X color="red" />
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"link"}>[Chi tiết]</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            <p className="mb-3">Câu {index + 1}</p>
                            <div
                              dangerouslySetInnerHTML={{ __html: el?.content }}
                            />
                          </DialogTitle>
                          <DialogDescription>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Giải thích</AccordionTrigger>
                                <AccordionContent>
                                <div
                              dangerouslySetInnerHTML={{ __html: el?.explain }}
                            />
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </DialogDescription>
                        </DialogHeader>
                        {el?.options?.map((e: any, _index: any) => {
                          return (
                            <div
                              className={
                                e == el?.answer
                                  ? "p-3 rounded-md bg-green-700"
                                  : e == history?.answers[index]
                                    ? "p-3 rounded-md bg-red-700"
                                    : "p-3 rounded-md bg-nav"
                              }
                            >
                              {e}
                            </div>
                          );
                        })}
                        <DialogFooter></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
