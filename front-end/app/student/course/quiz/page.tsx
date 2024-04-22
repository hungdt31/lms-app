"use client";
import Quiz from "@/lib/axios/quiz";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Countdown from "react-countdown";
import UserQuery from "@/hooks/user";
// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = (data: any) => {
  const { hours, minutes, seconds, completed } = data;
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
};
export default function Page() {
  const [time, setTime] = useState<any>(0);
  const router = useRouter();
  const user = UserQuery();
  // console.log(user);
  const id: string = useSearchParams().get("id") as string;
  const [quiz, setQuiz] = useState<any>(null);
  const fetchQuizPlay = async () => {
    const quiz = await Quiz.GetQuizPlay(id);
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
  return (
    <div className="p-5">
      <h1>Quiz page</h1>
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
      {quiz ? (
        <Button
          onClick={() => {
            router.push(`/student/course/quiz/play?id=${id}`);
          }}
        >
          Tiến tục làm bài
        </Button>
      ) : (
        <Button
          onClick={async () => {
            await Quiz.StartQuiz(id, user?.data?.data?.id);
            //console.log(rs);
            router.push(`/student/course/quiz/play?id=${id}`);
          }}
        >
          Bắt đầu
        </Button>
      )}
    </div>
  );
}
