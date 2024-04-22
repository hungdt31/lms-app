import { useQuery } from "@tanstack/react-query";
import Quiz from "@/lib/axios/quiz"
export function QuizResultQuery(id: string) {
  const fetchQuiz = async () => {
    const user = await Quiz.GetResult(id);
    return user;
  };

  const quiz: any = useQuery({
    queryKey: ["quizResultData"],
    queryFn: fetchQuiz,
  });
  return quiz;
}