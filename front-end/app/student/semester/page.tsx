"use client";
import "./styles.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import TimeConvert from "@/helpers/TimeConvert";
import { SemesterResultQuery } from "@/hooks/semester";
import { Layers } from "lucide-react";
import { BlockLoading } from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SemesterQuery from "@/hooks/semester";
import { Button } from "@/components/ui/button";
import Cookies from "universal-cookie";
import UserQuery from "@/hooks/user";
import Semester from "@/lib/axios/semester";
const special_score = [
  {
    name: "Cấm thi",
    score: 11,
    char: "CT",
    des: "Được tính như điểm 0",
  },
  {
    name: "Miễn học, miễn thi",
    score: 12,
    char: "MT",
    des: "Đạt nhưng không tính vào ĐTB",
  },
  {
    name: "Vắng thi",
    score: 13,
    char: "VT",
    des: "Được tính như điểm 0",
  },
  {
    name: "Hoãn thi, được phép thi sau",
    score: 14,
    char: "HT",
    des: "Không đạt và không tính vào ĐTB Được thỏa điều kiện môn học trước",
  },
  {
    name: "Chưa có điểm",
    score: 15,
    char: "CH",
    des: "Chưa tính số TCTL và ĐTB",
  },
  {
    name: "Rút môn học ",
    score: 17,
    char: "RT",
    des: "Không ghi vào bảng điểm",
  },
];
export default function TeacherPage() {
  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const Xep_Loai = (score: number) => {
    if (score >= 9.5) return "A+";
    else if (score >= 8.5) return "A";
    else if (score >= 8) return "B+";
    else if (score >= 7) return "B";
    else if (score >= 6.5) return "C+";
    else if (score >= 5.5) return "C";
    else return "D";
  };
  const [tkb, setTkb] = useState<any>(null);
  const fetchTKB = async () => {
    const rs: any = await Semester.GetTKB({ id: info?.id, token });
    setTkb(rs?.data);
    console.log(rs?.data);
  };
  const mutation = SemesterResultQuery();
  const { data } = SemesterQuery();
  const token = new Cookies().get("token");
  const [info, setInfo] = useState<any>(null);
  const [total_credit, setTotalCredit] = useState<any>(0);
  const [total, setTotal] = useState<any>(0);
  const user = UserQuery();
  // console.log(mutation);
  useEffect(() => {
    //console.log(mutation?.data);
    let sum = 0;
    let total_credit = 0;
    for (let i = 0; i < mutation?.data?.data?.length; i++) {
      console.log(mutation?.data?.data[i]?.average_score);
      total_credit =
        total_credit + Number(mutation?.data?.data[i]?.course.credit);
      sum =
        sum +
        Number(
          mutation?.data?.data[i]?.average_score *
            mutation?.data?.data[i]?.course.credit,
        );
    }
    setTotalCredit(total_credit);
    sum = parseFloat((sum / total_credit).toFixed(1));
    setTotal(sum);
    if (mutation?.data) fetchTKB();
  }, [mutation?.data]);
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex gap-5 items-center mt-5 lg:flex-row flex-col">
        <Select
          onValueChange={(el: any) => {
            setInfo(el);
            mutation.mutate({
              id: el?.id,
              token,
            });
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((el: any, index: any) => {
              return (
                <SelectItem value={el} key={index}>
                  {el?.description}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {info && (
          <div className="flex gap-4 sm:flex-row flex-col mb-3 sm:mb-0 items-center">
            {" From "}
            <Button variant={"secondary"}>
              {TimeConvert(info?.start_date)}
            </Button>
            {" to "}
            <Button variant={"secondary"}>{TimeConvert(info?.end_date)}</Button>
          </div>
        )}
      </div>
      <div className="flex justify-center px-3 pt-5 lg:px-0">
        <Table>
          <TableCaption>Danh sách khóa học</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead>Số tín</TableHead>
              <TableHead>Điểm thành phần</TableHead>
              <TableHead className="text-right">Điểm tổng kết</TableHead>
              <TableHead className="text-right">Xếp loại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mutation.isPending && <BlockLoading />}
            {mutation.isError && <p>Something is not good ..</p>}
            {mutation.isSuccess &&
              mutation.data?.data?.map((el: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-bold">
                      {el?.course?.title}
                    </TableCell>
                    <TableCell>{el?.course?.credit}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            [{el.score_array.join(", ")}]
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          {el.score_array.map((e: any, index: any) => {
                            return (
                              <p className="font-mono" key={index}>
                                {el?.course.name_factor[index]} (
                                {el?.course.score_factor[index] * 100}%) : {e}
                              </p>
                            );
                          })}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">
                      {el?.average_score}
                    </TableCell>
                    <TableCell className="text-center">
                      {Xep_Loai(el?.average_score)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Kết quả</TableCell>
              <TableCell colSpan={2}>{total_credit}</TableCell>
              <TableCell colSpan={2} className="text-center">
                {total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <Accordion type="single" collapsible className="w-[80%] m-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>Thời khóa biểu</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto rounded-lg shadow-sm border-l-2 border-r-2 border-nav">
              <table className="table table-sm table-pin-rows table-pin-cols text-lg ">
                <thead>
                  <tr>
                    <td></td>
                    <td>Môn học</td>
                    <td>Số tín chỉ</td>
                    <td>Tuần học</td>
                    <td>Giờ học</td>
                  </tr>
                </thead>
                <tbody>
                  {tkb?.map((el: any, index: any) => {
                    if (el?.length === 0) {
                      return (
                        <tr key={index}>
                          <td colSpan={5} className="font-bold">
                            {week[index]}
                          </td>
                        </tr>
                      );
                    } else {
                      return el?.map((e: any, i: number) => {
                        return (
                          <tr key={`${index}-${i}`}>
                            {i === 0 && (
                              <td
                                rowSpan={el.length}
                                className="border-r-2 font-bold border-nav"
                              >
                                {week[index]}
                              </td>
                            )}
                            <td className="border-r-2 border-nav">
                              {e?.title} ({e?.course_id})
                            </td>
                            <td className="border-r-2 border-nav">
                              {e?.credit}
                            </td>
                            <td className="border-r-2 border-nav">
                              {e?.schedule.join(", ")}
                            </td>
                            <td>{e?.time}</td>
                          </tr>
                        );
                      });
                    }
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Mô tả</AccordionTrigger>
          <AccordionContent>
            {/* A+ : 9.5 - 10 <br />
            A : 8.5 - 9.4 <br />
            B+ : 8 - 8.4 <br />
            B : 7 - 7.9 <br />
            C+ : 6.5 - 6.9 <br />
            C : 5.5 - 6.4 <br />
            D : 0 - 5.4 <br /> */}
            <Table className="shadow-sm">
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại điểm</TableHead>
                  <TableHead>Điểm số</TableHead>
                  <TableHead>Điểm chữ</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {special_score.map((el, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>{el.score}</TableCell>
                      <TableCell>{el.char}</TableCell>
                      <TableCell>{el.des}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow></TableRow>
              </TableFooter>
            </Table>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Phản hồi</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis sit
            commodi, cumque consectetur fugit laborum repudiandae est voluptatem
            optio recusandae similique minus corporis eaque perspiciatis, hic
            culpa nihil voluptate unde.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
