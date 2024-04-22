"use client";
import { useSearchParams } from "next/navigation";
import { QuizResultQuery } from "@/hooks/result";
export default function ResultPage() {
  const id: string = useSearchParams().get("id") as string;
  const { data } = QuizResultQuery(id);
  //console.log(data);
  return (
    <div>
      <p>Result Page</p>
      <p>Điểm thi: [{data?.data?.score.join(', ')}]</p>
      <p>{data?.mess}</p>
    </div>
  );
}
