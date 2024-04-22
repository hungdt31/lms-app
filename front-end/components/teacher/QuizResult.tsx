"use client";
import Quiz from "@/lib/axios/quiz";
import { useEffect, useState } from "react";
import TimeConvert from "@/helpers/TimeConvert";
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
export default function QuizResult(data: any) {
  const { uid, cid } = data;
  const [total, setTotal] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const fetchQuizResult = async () => {
    const rs = await Quiz.GetAllQuizResultByUser({ uid, cid });
    console.log(rs?.data);
    setResult(rs?.data);
    let s = 0;
    for (let i = 0; i < rs?.data?.length; i++) {
      let sum = 0;
      for (let j = 0; j < rs?.data[i]?.score?.length; j++) {
        sum = sum + rs?.data[i].score[j];
      }
      console.log(sum);
      sum = (sum * rs?.data[i]?.quiz?.factor) / rs?.data[i]?.score?.length;
      s = s + sum;
    }
    setTotal(s);
  };
  useEffect(() => {
    fetchQuizResult();
  }, []);
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Tên quiz</TableHead>
            <TableHead>Thời điểm hoàn thành</TableHead>
            <TableHead>Hệ số</TableHead>
            <TableHead className="text-right">Điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result?.map((el: any, index: any) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{el?.quiz?.title}</TableCell>
              <TableCell>{TimeConvert(el?.createdAt)}</TableCell>
              <TableCell>{el?.quiz?.factor}</TableCell>
              <TableCell className="text-right">
                [{el?.score.join(", ")}]
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
