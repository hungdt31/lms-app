"use client";
import Course from "@/lib/axios/course";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import formSchema from "@/lib/zod/ScoreArray";
import Grade from "@/lib/axios/result";
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
import Swal from "sweetalert2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function TotalPoint(data: any) {
  const { cid, uid } = data;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score_array: [
        {
          score: 0,
        },
        {
          score: 0,
        },
        {
          score: 0,
        },
        {
          score: 0,
        },
      ],
    },
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty, defaultValues },
    reset,
  } = form;
  const { fields, append, remove, prepend } = useFieldArray({
    name: "score_array",
    control,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [scoreFactor, setScoreFactor] = useState<any>(null);
  const [gradeCourse, setGradeCourse] = useState<any>(null);
  const fetchScoreFactor = async () => {
    const res = await Course.GetScoreFactor(cid);
    setScoreFactor(res?.data);
    console.log(res);
  };
  const fetchGrade = async () => {
    const res = await Grade.GetCourseResult({ cid, uid });
    console.log(res);
    setGradeCourse(res?.data);
  };
  useEffect(() => {
    fetchScoreFactor();
    fetchGrade();
  }, []);
  const onSubmit = async (data: any) => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(data);
        let new_data = [];
        for (let i = 0; i < data.score_array.length; i++) {
          new_data.push(data.score_array[i].score);
        }
        console.log(new_data);
        const obj = {
          courseId: cid,
          userId: uid,
          score_array: new_data,
        };
        const rs: any = await Grade.UpdateCourseResult(obj);
        Swal.fire({
          icon: rs?.success ? "success" : "error",
          title: rs?.mess,
          showConfirmButton: false,
          timer: 1500,
        });
        fetchGrade();
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={gradeCourse?.user?.avatar} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base font-bold">{gradeCourse?.user?.username}</h1>
          <h1 className="text-xs font-light">{gradeCourse?.user?.email}</h1>
        </div>
      </div>
      {gradeCourse ? (
        <div className="p-3">
          <Table>
            <TableCaption>{gradeCourse?.course?.title}</TableCaption>
            <TableHeader>
              <TableRow>
                {scoreFactor?.name_factor?.map((el: string, index: any) => (
                  <TableCell key={index} className="font-medium">
                    {el} ({scoreFactor?.score_factor[index] * 100}%)
                  </TableCell>
                ))}
                <TableCell key="" className="font-medium">
                  Điểm tổng kết
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {gradeCourse?.score_array?.map((el: any) => (
                  <TableCell className="font-medium">{el}</TableCell>
                ))}
                <TableCell className="font-bold text-right">
                  {gradeCourse?.average_score}
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
            </TableBody>
          </Table>
          <Button onClick={() => setOpen(!open)}>Update</Button>
          {open && (
            <div className="flex justify-center">
              <Card className="w-[350px] mt-5">
                <CardHeader>
                  <CardTitle>Update new total point</CardTitle>
                  <CardDescription>
                    Deploy your new point in one-click.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent>
                    {fields?.map((filed, index) => {
                      const errorForField = errors?.score_array?.[index]?.score;
                      return (
                        <div>
                          <Label htmlFor={`score_array.${index}.score`}>
                            {scoreFactor?.name_factor[index]}
                          </Label>
                          <Input
                            {...register(`score_array.${index}.score`, {
                              valueAsNumber: true,
                            })}
                          />
                          {errorForField && (
                            <p className="text-red-500 font-light text-xs py-3">
                              {errorForField?.message}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="submit">Submit</Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Chưa tổng kết điểm</p>
          <Button className="p-5">
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}
