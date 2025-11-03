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
import { Badge } from "@/components/ui/badge";
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
    <div className="pb-24 lg:pb-16">
      <div className="flex items-center flex-col mt-2 mb-4">
        {isLoading ? (
          <>
            <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse" />
            <p className="h-4 w-36 mt-2 rounded bg-gray-100 animate-pulse" />
          </>
        ) : (
          <>
            <div className="font-bold text-3xl tracking-tight text-foreground">
              {data?.data?.title}
            </div>
            <div className="h-1 w-20 bg-primary rounded mt-1" />
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Mã học phần: {data?.data?.course_id}
            </p>
          </>
        )}
      </div>
      <Header />
      <br />
      <br />
      {index == "0" ? (
        <div className="flex justify-center mx-4">
          <div className="lg:w-[60%] w-full rounded-xl shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="mb-4">
                      <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
                      <div className="mt-3 h-24 w-full rounded bg-gray-50 animate-pulse" />
                    </div>
                  ))
                : (data?.data?.DocumentSections?.length
                    ? data?.data?.DocumentSections
                    : [])?.map((el: any, index: any) => (
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
                            {el?.documentLink?.length
                              ? el?.documentLink?.map((DocLink: any, idx: any) => (
                                  <DocCard
                                    key={idx}
                                    title={DocLink?.title}
                                    url={DocLink?.url}
                                    description={DocLink?.description}
                                  />
                                ))
                              : <p className="text-sm text-muted-foreground">Không có tài liệu</p>}
                          </div>
                          <br />
                          <div className="flex flex-col gap-3 w-[100%]">
                            {el?.quiz?.length
                              ? el?.quiz?.map((q: any, idx: number) => (
                                  <QuizCard
                                    key={idx}
                                    title={q?.title}
                                    description={q?.description}
                                    id={q?.id}
                                  />
                                ))
                              : <p className="text-sm text-muted-foreground">Không có bài trắc nghiệm</p>}
                          </div>
                          <br />
                          <div className="flex flex-col gap-3 w-[100%]">
                            {el?.submissions?.length
                              ? el?.submissions?.map((submission: any, idx: any) => (
                                  <SubmissionCard
                                    key={idx}
                                    title={submission?.title}
                                    createdAt={submission?.createdAt}
                                    id={submission?.id}
                                  />
                                ))
                              : <p className="text-sm text-muted-foreground">Không có bài nộp</p>}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              {!isLoading && (!data?.data?.DocumentSections || data?.data?.DocumentSections?.length === 0) && (
                <div className="w-full py-10 text-center text-muted-foreground">Không có nội dung</div>
              )}
            </Accordion>
          </div>
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
          <div className="flex flex-col items-center justify-center mx-4">
            <Accordion type="single" collapsible className="lg:w-[60%] w-full rounded-xl shadow-sm">
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
                    <div className="flex flex-col gap-4 flex-wrap">
                      {el?.videos?.map((video: any, idx: any) => (
                        <Link
                          key={idx}
                          href={video?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-accent/40">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <SquarePlay size={28} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate">{video?.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {video?.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                              {video?.provider}
                            </Badge>
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
            <div className="lg:w-[60%] w-full my-9 flex flex-col gap-3">
              {data?.data?.forum?.length
                ? data?.data?.forum?.map((forum: any, idx: any) => (
                    <ForumCard key={idx} title={forum?.title} id={forum?.id} />
                  ))
                : <p className="text-sm text-muted-foreground text-center">Chưa có chủ đề</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
