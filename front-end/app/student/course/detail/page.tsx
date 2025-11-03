"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
import { Button } from "@/components/ui/button";
import { SquarePlay } from "lucide-react";
import Grade from "@/lib/axios/result";
import Link from "next/link";
import { FileUp, FileQuestion } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "./header";
import QuizCard from "@/components/card/quiz";
import SubmissionCard from "@/components/card/submission";
import DocCard from "@/components/card/docLink";
import { useEffect, useMemo, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import ForumCard from "@/components/card/forum";
import { CourseScoreAndSubmitQuery } from "@/hooks/result";
export default function DetailCourse() {
  const token = useMemo(() => new Cookies().get("token"), []);
  const router = useRouter();
  const index: string = useSearchParams().get("index") as string;
  const course_id: string = useSearchParams().get("id") as string;
  const { data, isLoading } = CourseQuery(course_id);
  const { data: resultResp, isLoading: resultLoading } = CourseScoreAndSubmitQuery(course_id);
  const result = resultResp?.data;
  return (
    <div>
      <div className="flex items-center flex-col">
        {isLoading ? (
          <>
            <div className="h-7 w-48 rounded-md bg-gray-200 animate-pulse" />
            <p className="pl-11 font-mono h-4 w-32 mt-2 rounded bg-gray-100 animate-pulse" />
          </>
        ) : (
          <>
            <div className="font-bold text-3xl">{data?.data?.title}</div>
            <p className="pl-11 font-mono">__ {data?.data?.course_id} __</p>
          </>
        )}
      </div>
      <Header />
      <br />
      <br />
      {index == "0" ? (
        <div className="flex justify-center mx-7">
          <Accordion type="single" collapsible className="lg:w-[60%] w-full">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="mb-4">
                    <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
                    <div className="mt-3 h-24 w-full rounded bg-gray-50 animate-pulse" />
                  </div>
                ))
              : data?.data?.DocumentSections?.map((el: any, index: any) => (
              <AccordionItem value={`item ${index + 1}`} key={index}>
                <AccordionTrigger className="font-bold text-xl">
                  {el?.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    dangerouslySetInnerHTML={{ __html: el?.content }}
                    className="mb-5 text-lg"
                  />
                  <div className="flex flex-col gap-5 flex-wrap">
                    <div className="flex flex-col gap-3 w-[100%]">
                      {el?.documentLink?.map((DocLink: any, idx: any) => (
                        <DocCard
                          key={idx}
                          title={DocLink?.title}
                          url={DocLink?.url}
                          description={DocLink?.description}
                        />
                      ))}
                    </div>
                    <br />
                    <div className="flex flex-col gap-3 w-[100%]">
                      {el?.quiz?.map((q: any, idx: number) => (
                        <QuizCard
                          key={idx}
                          title={q?.title}
                          description={q?.description}
                          id={q?.id}
                        />
                      ))}
                    </div>
                    <br />
                    <div className="flex flex-col gap-3 w-[100%]">
                      {el?.submissions?.map((submission: any, idx: any) => (
                        <SubmissionCard
                          key={idx}
                          title={submission?.title}
                          createdAt={submission?.createdAt}
                          id={submission?.id}
                        />
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : index == "1" ? (
        <div>
          <div className="flex items-center">
            <div className="flex gap-3 items-center mb-3 sm:ml-[20%] ml-0 pl-3 sm:pl-0">
              <div className="avatar relative">
                <div className="w-20 mask mask-hexagon rounded-lg">
                  <img src={data?.data?.teacher?.avatar} />
                </div>
              </div>
              <div>
                <p className="font-bold flex gap-3">
                  <PiChalkboardTeacherBold />{" "}
                  <p>
                    {data?.data?.teacher?.firstname}{" "}
                    {data?.data?.teacher?.lastname}
                  </p>
                </p>
                <p className="text-sm">{data?.data?.teacher?.email}</p>
              </div>
            </div>
          </div>
          <Table className="lg:w-[60%] m-auto mb-5">
            <TableCaption>A list of your test</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Bài kiểm tra</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Phần trăm</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(resultLoading ? [] : result?.quizResult) ?.map((el: any, index: number) => (
                <TableRow key={index} onClick={() => {}}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{el?.quiz?.title}</TableCell>
                  <TableCell>{el?.total_score}</TableCell>
                  <TableCell>{el?.quiz?.factor * 100}%</TableCell>
                  <TableCell className="text-right">
                    <FileQuestion />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={"link"}
                      onClick={() =>
                        router.push(`/student/course/quiz?id=${el?.quiz?.id}`)
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(resultLoading ? [] : result?.submitResult) ?.map((el: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1 + (result?.quizResult.length || 0)}
                  </TableCell>
                  <TableCell>{el?.submission?.title}</TableCell>
                  <TableCell>{el?.score}</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    <FileUp />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={"link"}
                      onClick={() =>
                        router.push(
                          `/student/course/submission?id=${el?.submission?.id}`,
                        )
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center mx-7">
            <Accordion type="single" collapsible className="lg:w-[60%] w-full">
              {data?.data?.VideoSections?.map((el: any, index: any) => (
                <AccordionItem value={`item ${index + 1}`} key={index}>
                  <AccordionTrigger className="font-bold text-xl">
                    {el?.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{ __html: el?.description }}
                      className="mb-5 text-lg"
                    />
                    <div className="flex flex-col gap-5 flex-wrap">
                      {el?.videos?.map((video: any, idx: any) => (
                        <Link
                          key={idx}
                          href={video?.url}
                          target="_blank"
                          className="relative"
                        >
                          <div className="flex items-center gap-3 bg-video_card rounded-lg p-3 shadow-md">
                            <SquarePlay
                              size={50}
                              className="text-nav-text"
                              width={100}
                            />
                            <Button className="absolute -bottom-2 -right-2">
                              {video?.provider}
                            </Button>
                            <div>
                              <p className="font-bold">{video?.title}</p>
                              <p>{video?.description}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <hr />
            <h3>Forum</h3>
            <div className="w-[60%] my-9 flex flex-col gap-3">
              {data?.data?.forum?.map((forum: any, idx: any) => (
                <ForumCard key={idx} title={forum?.title} id={forum?.id} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
