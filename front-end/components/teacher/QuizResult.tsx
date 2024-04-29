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
      s = s + rs?.data[i]?.total_score * rs?.data[i]?.quiz?.factor;
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
            <TableHead className="text-right">Các lần làm</TableHead>
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
              <TableCell className="text-right">{el?.total_score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
