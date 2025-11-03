"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TimeConvert from "@/helpers/TimeConvert";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CgAlignMiddle } from "react-icons/cg";
import Quiz from "@/lib/axios/quiz";
import DataTable from "./DataTable";
import { quiz_columns } from "@/helpers/Column";
import { SlPeople } from "react-icons/sl";
import { FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import React from "react";
import BarChart from "./BarChart";
import { Badge } from "@/components/ui/badge";
function GridItem({ title, children }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl h-[400px] m-5">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
export default function QuizPage() {
  const router = useRouter();
  const id: any = useSearchParams().get("qid");
  const [quiz, setQuiz] = useState<any>(null);
  const fetchData = async () => {
    const rs: any = await Quiz.GetQuizInfo(id);
    // console.log(rs);
    setQuiz(rs?.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-center px-2 mb-3">
        <div className="sm:w-[80%] w-full">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Quay về khóa học
          </Button>
        </div>
      </div>
      <div className="flex justify-center px-2">
        <div className="bg-background grid grid-cols-3 shadow-lg rounded-l-lg rounded-r-lg border-2">
          <div className="p-7 items-center flex flex-col gap-3 border-r-2">
            <FaInfoCircle size={30} color="green" />
            <div className="font-bold text-green-700 text-xl text-center">
              Điểm trung bình
            </div>
            <div className="text-center font-bold text-xl">
              {quiz?.average_score}
            </div>
          </div>

          <div className="p-7 items-center flex flex-col gap-3 border-r-2">
            <SlPeople size={30} color="red" />
            <div className="font-bold text-red-700 text-xl text-center">
              Lượt làm
            </div>
            <div className="text-center font-bold text-xl">{quiz?.attemp}</div>
          </div>

          <div className="p-7 items-center flex flex-col gap-3">
            <CgAlignMiddle size={30} />
            <div className="font-bold text-gray-700 text-xl text-center">
              Khoảng điểm
            </div>
            <div className="text-center font-bold text-xl">
              {quiz?.min_score} - {quiz?.max_score}
            </div>
          </div>
        </div>
      </div>
      <GridItem title="Quiz Bar Chart">
        <BarChart data={quiz?.chart_data} />
      </GridItem>
      <div className="flex justify-center">
        <Accordion type="single" collapsible className="sm:w-[80%] w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold">
              Bài kiểm tra: {quiz?.title}
            </AccordionTrigger>
            <AccordionContent className="flex gap-3 items-center flex-wrap">
              {quiz?.questions?.map((question: any, index: number) => (
                <AlertDialog key={index}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Câu {index + 1}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: question?.content,
                          }}
                        />
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <p className="font-sm text-gray-500 pb-3">
                          Giải thích:{" "}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: question?.explain,
                            }}
                          />
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {question?.options.map(
                            (option: any, index: number) => (
                              <div key={index}>
                                <Badge
                                  variant={
                                    question?.answer == option
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {option}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Thời gian</AccordionTrigger>
            <AccordionContent>
              {TimeConvert(quiz?.start_date)} - {TimeConvert(quiz?.end_date)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {quiz?.result && <DataTable columns={quiz_columns} data={quiz?.result} />}
    </div>
  );
}
