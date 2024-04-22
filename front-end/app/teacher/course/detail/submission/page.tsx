"use client";
import TimeConvert from "@/helpers/TimeConvert";
import { FaRegFilePdf } from "react-icons/fa6";
import { BsFiletypeDocx } from "react-icons/bs";
import { z } from "zod";
import Swal from "sweetalert2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUp } from "lucide-react";
import Submission from "@/lib/axios/submission";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function SubmissionPage() {
  const router = useRouter();
  const mySchema = z
    .number()
    .nonnegative({ message: "Score must be non-negative" })
    .min(0, { message: "Score must be greater than 0" })
    .max(10, { message: "Score must be less than or equal 10" });
  const sid: string = useSearchParams().get("sid") as string;
  const uid: string = useSearchParams().get("uid") as string;
  const cid: string = useSearchParams().get("id") as string;
  const [submission, setSubmission] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [open, setOpen] = useState<Boolean>(false);
  const [score, setScore] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const GetIcon = (str: string) => {
    if (str.includes(".pdf")) return <FaRegFilePdf size={20} />;
    else if (str.includes(".docx")) return <BsFiletypeDocx size={20} />;
    else return <IoDocumentTextOutline size={20} />;
  };
  const fetchSubmission = async () => {
    const submit = await Submission.GetSubmission(sid);
    console.log(submit);
    setSubmission(submit?.data);
  };
  const fetchSubmissionResult = async () => {
    const submit = await Submission.GetSubmissionResult({
      submissionId: sid,
      userId: uid,
    });
    setSubmitResult(submit?.data);
    console.log(submit);
  };
  useEffect(() => {
    fetchSubmission();
    {
      uid && fetchSubmissionResult();
    }
  }, []);
  const handleScoreChange = (e: any) => {
    const newScore = Number(e.target.value);
    //console.log(newScore);
    setScore(newScore);

    const rs = mySchema.safeParse(newScore);
    if (!rs.success) {
      setErrorMessage(rs.error.errors[0].message);
    } else {
      setErrorMessage("");
    }
    //console.log(rs);
  };
  const handleSubmit = async (id: string) => {
    const rs: any = await Submission.UpdateSubmissionResult({
      score,
      id,
    });
    Swal.fire({
      icon: rs?.success ? "success" : "error",
      title: rs?.mess,
      text: "Update score successfully",
      showConfirmButton: true,
      confirmButtonText: rs?.success ? "Ok" : "Try again",
    }).then((result) => {
      if (result.isConfirmed && rs?.success)
        router.push(
          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/stinfo?id=${uid}&cid=${cid}`,
        );
      else {
        setOpen(false)
        fetchSubmissionResult()
      }
    });
  };
  return (
    <div className="w-full">
      <div className="text-rose-900 flex items-center gap-3 my-5">
        <FileUp size={30} />
        <h1 className="font-bold text-2xl">{submission?.title}</h1>
      </div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex gap-3 items-center">
            <CardTitle>Opened:</CardTitle>
            <CardDescription>
              {TimeConvert(submission?.start_date)}
            </CardDescription>
          </div>
          <div className="flex gap-3 items-center">
            <CardTitle>Due:</CardTitle>
            <CardDescription>
              {TimeConvert(submission?.end_date)}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="mt-5">
          <div
            dangerouslySetInnerHTML={{ __html: submission?.description }}
          ></div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-3">
            {submission?.files?.map((el: any) => {
              return (
                <div className="flex gap-3 items-center flex-wrap">
                  {GetIcon(el?.title)}
                  <a href={el?.url} target="_blank" className="text-cyan-500 hover:underline">
                    {el.title}
                  </a>
                  <p className="ml-3 text-xs text-gray-500">
                    {TimeConvert(el?.createdAt)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardFooter>
      </Card>
      {uid && (
        <Card className="w-full mt-5">
          <CardHeader>
            <div className="flex gap-3 items-center">
              <CardTitle>Đã nộp:</CardTitle>
              <CardDescription>
                {TimeConvert(submitResult?.createdAt)}
              </CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="mt-5">
            <div className="flex gap-3 items-center">
              <p className="font-bold">From</p>
              <Avatar>
                <AvatarImage src={submitResult?.user?.avatar} />
                <AvatarFallback>
                  {submitResult?.user?.firstname[0]}
                  {submitResult?.user?.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">
                  {submitResult?.user?.firstname} {submitResult?.user?.lastname}
                </p>
                <p className="text-gray-500">{submitResult?.user?.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-3">
              <p className="font-bold">Bài nộp</p>
              {submitResult?.files?.map((el: any) => {
                return (
                  <div className="flex gap-3 items-center flex-wrap">
                    {GetIcon(el?.title)}
                    <a href={el?.url} target="_blank" className="text-cyan-500 hover:underline">
                      {el.title}
                    </a>
                    <p className="ml-3 text-xs text-gray-500">
                      {TimeConvert(el?.createdAt)}
                    </p>
                  </div>
                );
              })}
              {submitResult?.isChecked ? (
                <div>
                  <div className="flex gap-3 items-center mb-3">
                    <p className="font-bold">Điểm:</p>
                    <p>{submitResult?.score}</p>
                  </div>
                  <div className="mb-3">
                    {submitResult?.beGraded && (
                      <p>
                        Đã chấm:{" "}
                        <i className="ml-3 text-xs text-gray-500">
                          {TimeConvert(submitResult?.beGraded)}
                        </i>
                      </p>
                    )}
                    {submitResult?.editGradeAt && (
                      <p>
                        Đã chỉnh sửa điểm:{" "}
                        <i className="ml-3 text-xs text-gray-500">
                          {TimeConvert(submitResult?.editGradeAt)}
                        </i>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 items-center">
                    {open ? (
                      <div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Nhập điểm"
                            className="border border-gray-300 p-2"
                            onChange={handleScoreChange}
                          />
                          {errorMessage && (
                            <p className="text-red-500">{errorMessage}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            variant={"secondary"}
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSubmit(submitResult?.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant={"secondary"}
                        onClick={() => setOpen(true)}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  {open ? (
                    <div>
                      <Input
                        type="number"
                        placeholder="Nhập điểm"
                        className="border border-gray-300 p-2"
                        onChange={handleScoreChange}
                      />
                      {errorMessage && (
                        <p className="text-red-500">{errorMessage}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          variant={"secondary"}
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleSubmit(submitResult?.id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant={"secondary"} onClick={() => setOpen(true)}>
                      Chấm điểm
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
