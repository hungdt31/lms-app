import { SquareCheckBig } from "lucide-react";
import Link from "next/link";
type quizInfo = {
  title: string;
  id: string;
  description: string;
  key: number;
};
export default function QuizCard(data: quizInfo) {
  return (
    <Link
      href={`/student/course/quiz?id=${data?.id}`}
      key={data?.key}
      className="dark:border-rose-500 border-2 border-black rounded-sm p-3 flex gap-3 items-center"
    >
      <div className="bg-rose-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
        <SquareCheckBig className="dark:text-rose-500" />
      </div>
      <div className="dark:text-rose-500">
        <p className="font-bold">{data?.title}</p>
        <p className="text-[12px]">{data?.description}</p>
      </div>
    </Link>
  );
}
