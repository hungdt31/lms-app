import { useQuery } from "@tanstack/react-query";
import Quiz from "@/lib/axios/quiz";
import Grade from "@/lib/axios/result";
import Cookies from "universal-cookie";

export function QuizResultQuery(id: string) {
  const fetchQuiz = async () => {
    const user = await Quiz.GetResult(id);
    return user;
  };

  const quiz: any = useQuery({
    queryKey: ["quizResultData", id],
    queryFn: fetchQuiz,
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
  return quiz;
}

export function CourseScoreAndSubmitQuery(courseId: string) {
  const token = new Cookies().get("token") ?? null;
  const fetchResult = async () =>
    await Grade.GetQuizResultAndSubmit({ id: courseId, token });

  const result = useQuery({
    queryKey: ["courseScoreSubmit", courseId],
    queryFn: fetchResult,
    enabled: Boolean(courseId && token),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
  return result as any;
}
