"use client";
import Submission from "@/lib/axios/submission";
import { useEffect } from "react";
import TimeConvert from "@/helpers/TimeConvert";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
export default function SubmissionPage(data: any) {
  const { cid, uid } = data;
  const router = useRouter();
  const [submitArray, setSubmitArray] = useState<any>(null);
  const fetchSubmission = async () => {
    const submit = await Submission.GetAllSubmissionResult({
      submissionId: cid,
      userId: uid,
    });
    setSubmitArray(submit?.data);
    // console.log(submit);
  };
  useEffect(() => {
    fetchSubmission();
  }, []);
  return (
    <div>
      <div>
        <Table>
          <TableCaption>{"A list of student's submit"}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead>Tên bài</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Ngày nộp</TableHead>
              <TableHead>Tình trạng</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submitArray?.map((el: any, index: any) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {el?.submission?.title}
                </TableCell>
                <TableCell className="font-medium">
                  {TimeConvert(el?.submission?.end_date)}
                </TableCell>
                <TableCell className="font-medium">
                  {TimeConvert(el?.createdAt)}
                </TableCell>
                <TableCell className="font-medium">
                  {el?.isChecked ? "Đã chấm" : "Đợi chấm"}
                </TableCell>
                <TableCell className="font-medium text-right">
                  {el?.isChecked ? el?.score : "..."}
                </TableCell>
                <TableCell className="font-medium">
                  {el?.isChecked ? (
                    <Button
                      onClick={() =>
                        router.push(
                          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail/submission?sid=${el?.submission?.id}&id=${cid}&uid=${uid}`,
                        )
                      }
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant={"secondary"}
                      onClick={() =>
                        router.push(
                          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail/submission?sid=${el?.submission?.id}&id=${cid}&uid=${uid}`,
                        )
                      }
                    >
                      Chấm điểm
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}></TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
