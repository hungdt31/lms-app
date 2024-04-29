"use client";
import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import UserQuery from "@/hooks/user";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Swal from "sweetalert2";
import { verifyJwtToken } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { QuizQuery } from "@/hooks/quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { StepForward, Upload } from "lucide-react";
import { GetResultQuery } from "@/hooks/quiz";
import Quiz from "@/lib/axios/quiz";
export default function CarouselDemo() {
  const cookies = new Cookies();
  const id: string = useSearchParams().get("id") as string;
  const [time, setTime] = useState<any>(0);
  const quiz = QuizQuery(id);
  const [quizPlay, setQuizPLay] = useState<any>(null);
  const user: any = UserQuery();
  const rs = GetResultQuery();
  const [buttonState, setButtonState] = React.useState<any>(null);
  const [hasUploaded, setHasUploaded] = useState<any>(false);
  const uploadAnswer = async () => {
    const radios = Array.from(document.querySelectorAll(".radio-item"));
    const selectedValues = [];
    for (let i = 0; i < radios?.length; i += 4) {
      const group = radios.slice(i, i + 4);
      const selectedRadio = group.find(
        (radio: any) => (radio as HTMLInputElement).ariaChecked === "true",
      );
      selectedValues.push(
        selectedRadio ? (selectedRadio as HTMLInputElement).value : null,
      );
    }
    console.log(selectedValues);
    rs.mutate({
      playId: quizPlay?.id,
      userId: user?.data?.data.id,
      quizId: quiz?.data?.data.id,
      answer: selectedValues,
    });
  };
  const fetchQuizPlay = async () => {
    const quiz = await Quiz.GetQuizPlay(id, user?.data?.data?.id);
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
    if (!hasUploaded && hours <= 0 && minutes <= 0 && seconds <= 0) {
      uploadAnswer();
      setHasUploaded(true);
    }
    setQuizPLay(quiz?.data);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchQuizPlay();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [time]);
  React.useEffect(() => {
    if (quiz?.isSuccess) {
      const arr = new Array(quiz.data?.data.questions.length).fill(false);
      setButtonState(arr);
    }
    if (rs?.isSuccess) {
      Swal.fire("Saved!", "", "success");
      router.push(
        `${process.env.NEXT_PUBLIC_FRONT_END}/student/course/quiz/result?id=${rs?.data?.data?.id}`,
      );
    }
  }, [quiz?.isSuccess, quiz?.data, rs?.isSuccess, rs?.data]);

  const router = useRouter();
  // console.log(quiz)
  if (quiz.isPending) {
    return <div>Loading data ....</div>;
  } else if (quiz.error) {
    return <div>Something is not good ...</div>;
  }
  const handleChangeValueRadio = () => {
    const radios = Array.from(document.querySelectorAll(".radio-item"));
    const array: any = [];
    for (let i = 0; i < radios.length; i += 4) {
      const group = radios.slice(i, i + 4);
      const selectedRadio = group.find(
        (radio: any) => (radio as HTMLInputElement).ariaChecked === "true",
      );
      if (selectedRadio) {
        array.push(true);
      } else array.push(false);
    }
    setButtonState(array);
  };
  const handleSubmit = () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        uploadAnswer();
        // console.log(rs)
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleClick = (index: any) => {
    const questionItems: any = document.querySelector(".question-item");
    window.scrollTo(0, index * questionItems?.clientHeight + 120);
  };
  return (
    <div>
      <div className="flex justify-center items-start gap-5">
        <div className="flex flex-col gap-3">
          {quiz?.data?.data?.questions.map((el: any, index: any) => (
            <div className="p-1 min-w-[30%] question-item">
              <Card className="min-w-[400px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Câu {index + 1}:</p>
                    <div className="flex gap-3 items-center">
                    <input type="checkbox" />
                    <p className="font-light text-[12px]">Đặt cờ</p>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: el?.content }} />
                </CardHeader>
                <CardContent className="">
                  <RadioGroup onValueChange={handleChangeValueRadio}>
                    {el?.options.map((m: any, index: any) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          key={index}
                          value={m}
                          id={index}
                          className="radio-item"
                        />
                        <Label htmlFor={m}>{m}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="lg:w-[15%]"></div>
        <Card className="fixed top-36 left-[70%] lg:block hidden">
          <CardHeader>
            <CardTitle className="font-bold text-xl">
              {quiz?.data?.data.title}
            </CardTitle>
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
            <div className="flex justify-center">
              <Button variant={"link"} onClick={handleClick}>
                Bảng câu hỏi
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-4 gap-4 place-content-start mt-5">
              {buttonState?.map((el: any, index: number) => (
                <Button
                  variant={el ? "default" : "secondary"}
                  key={el?.index}
                  onClick={() => {
                    handleClick(index);
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit}>
              <CheckIcon className="mr-2 h-4 w-4" /> Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="rounded-full fixed top-[50%] left-2 bg-nav p-3 text-nav-text lg:hidden"
          >
            <StepForward />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-nav text-nav-text">
            <div className="font-bold text-xl text-center">
              {quiz?.data?.data.title}
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
            <div className="flex justify-center">
              <Button variant={"link"} onClick={handleClick}>
                Bảng câu hỏi
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 place-content-start mt-5">
              {buttonState?.map((el: any, index: number) => (
                <Button
                  variant={el ? "default" : "secondary"}
                  key={el?.index}
                  onClick={() => {
                    handleClick(index);
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button className="w-full mt-5" onClick={handleSubmit}>
              <CheckIcon className="mr-2 h-4 w-4" /> Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
