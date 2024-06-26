import { useMutation, useQuery } from "@tanstack/react-query";
import Quiz from "@/lib/axios/quiz";
export function QuizQuery(id: String) {
  const fetchQuiz = async () => {
    const user = await Quiz.GetQuiz(id);
    return user;
  };

  const quiz: any = useQuery({
    queryKey: ["quizData"],
    queryFn: fetchQuiz,
  });
  return quiz;
}
export function GetResultQuery() {
  const fetchResultQuiz = async (data: any) => {
    const sol = await Quiz.MarkQuiz(data);
    return sol;
  };
  const result: any = useMutation({
    mutationKey: ["resultData"],
    mutationFn: (data: any) => fetchResultQuiz(data),
  });
  return result;
}
export function QuizPlayQuery(id: string, uid: string) {
  const fetchQuizPlay = async () => {
    const quiz = await Quiz.GetQuizPlay(id, uid);
    return quiz;
  };
  const quiz: any = useQuery({
    queryKey: ["quizPlay"],
    queryFn: fetchQuizPlay,
  });
  return quiz;
}
