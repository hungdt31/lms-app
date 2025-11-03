"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Quiz from "@/lib/axios/quiz";
import { RiChatDeleteFill } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { type CarouselApi } from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Swal from "sweetalert2";
import formSchema from "@/lib/zod/QuizUpload";
import { Button } from "@/components/ui/button";
import LoginLooading from "@/components/loading/login";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/text-editor";
export default function UploadQuiz() {
  const router = useRouter();
  const id: string = useSearchParams().get("id") as string;
  const did: string = useSearchParams().get("did") as string;
  const [loading, setLoading] = useState(false);
  const [api, setApi] = React.useState<CarouselApi>();
  const form: any = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizData: {
        title: "",
        description: "",
        time_limit: 600000,
        factor: 0,
        start_date: new Date(),
        end_date: new Date(),
        documentSectionId: did,
        typePoint: "Average",
      },
      questions: [
        {
          content: "1 + 1 = ?",
          options: [],
          answer: "",
          explain: "",
        },
      ],
    },
  });
  const handleChange = (e: any, index: any) => {
    const value = form.getValues(`questions[${index}].options[${e}]`);
    form.setValue(`questions[${index}].answer`, value);
  };
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty, defaultValues },
    reset,
  } = form;
  // console.log(defaultValues)
  // console.log(errors)
  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });
  // console.log(fields)
  // console.log(errors);
  const onSubmit = async (data: any) => {
    setLoading(true);
    const result: any = await Quiz.CreateQuiz(data);
    if (result?.success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: result?.mess,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push(`/teacher/course/detail?id=${id}`);
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: result?.mess,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setLoading(false);
    console.log(data);
  };
  // Sử dụng TextEditor nội bộ, không cần cấu hình ngoài
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-6 items-center"
    >
      <div className="flex flex-col gap-5 w-full lg:max-w-md">
        <Input
          type="text"
          placeholder="Nhập tên bài kiểm tra"
          {...register("quizData.title")}
        />
        {errors?.quizData?.title && (
          <span className="text-red-500 font-light text-[14px]">
            {errors?.quizData?.title.message}
          </span>
        )}
        <Textarea
          placeholder="Nhập mô tả bài kiểm tra"
          {...register("quizData.description")}
        />
        <Label>Thời gian giới hạn (ms)</Label>
        <Input
          type="number"
          min={300000}
          placeholder="Nhập thời gian giới hạn"
          {...register("quizData.time_limit", { valueAsNumber: true })}
        />
        <Label>Hệ số</Label>
        <Input
          type="number"
          placeholder="Nhập hệ số"
          {...register("quizData.factor", { valueAsNumber: true })}
        />
        <Label>Ngày bắt đầu và kết thúc</Label>
        <div className="flex gap-3 justify-between items-center">
          <Input
            type="date"
            {...register("quizData.start_date", { valueAsDate: true })}
          />
          <p>to</p>
          <Input
            type="date"
            {...register("quizData.end_date", { valueAsDate: true })}
          />
        </div>
        <Select
          onValueChange={(content) =>
            form.setValue("quizData.typePoint", content)
          }
          defaultValue="Average"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn cách tính điểm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Average">Điểm trung bình</SelectItem>
              <SelectItem value="Max">Điểm lớn nhất</SelectItem>
              <SelectItem value="Last">Điểm cuối cùng</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grow flex flex-col items-center w-full">
        <Carousel
          className="w-full lg:w-3/4 max-w-[900px] mt-3"
          setApi={setApi}
        >
          <CarouselContent>
            {fields.map((field, index) => {
              const errorForField = errors?.questions?.[index]?.content;
              return (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-end">
                          <RiChatDeleteFill
                            size={30}
                            onClick={() => remove(index)}
                          />
                        </div>

                        <p className="text-4xl font-semibold text-center mb-5">
                          {index + 1}
                        </p>
                        <TextEditor
                          defaultContent="The topic of question"
                          onChange={(content) => {
                            form.setValue(`questions.${index}.content`, content);
                          }}
                        />
                        <div className="mt-3">
                          <Label>Giải thích</Label>
                          <TextEditor
                            defaultContent="Explain the question"
                            onChange={(content) => {
                              form.setValue(`questions.${index}.explain`, content);
                            }}
                          />
                        </div>
                        <p className="text-red-500 font-light text-[14px] mt-3">
                          {errorForField?.message ?? <>&nbsp;</>}
                        </p>
                        <div className="flex justify-center">
                          <RadioGroup
                            className="mt-5 ratio-group w-full"
                            onValueChange={(e) => handleChange(e, index)}
                          >
                            {Array.from({ length: 4 }).map((_, _index: any) => {
                              return (
                                <div
                                  className="flex items-center space-x-2"
                                  key={_index}
                                >
                                  <RadioGroupItem
                                    value={_index}
                                    id={_index}
                                    className="radio-item"
                                  />
                                  <div className="flex-1">
                                    <Input
                                      {...register(
                                        `questions.${index}.options.${_index}` as const,
                                      )}
                                      className="shrink"
                                      placeholder={`Phương án ${String.fromCharCode(65 + _index)}`}
                                    />
                                    {errors?.questions?.[index]?.options?.[
                                      _index
                                    ] && (
                                      <p className="text-red-500 font-light text-[14px]">
                                        {
                                          errors?.questions[index]?.options[
                                            _index
                                          ]?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </div>
                      </CardContent>
                      {errors?.questions?.[index]?.answer && (
                        <p className="text-red-500 font-light text-[14px] px-3 pb-3">
                          {errors?.questions[index]?.answer?.message}
                        </p>
                      )}
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex flex-wrap gap-3 my-5 justify-center">
          {fields.map((_, index) => {
            return (
              <Button
                variant={"secondary"}
                key={index}
                onClick={() => {
                  api?.scrollTo(index);
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        {loading ? (
          <LoginLooading />
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                append({
                  content: "",
                  options: ["", "", "", ""],
                  answer: "",
                  explain: "",
                });
                api?.reInit();
              }}
              variant={"secondary"}
            >
              Thêm câu hỏi
            </Button>
            <Button type="submit">Hoàn thành</Button>
          </div>
        )}
      </div>
    </form>
  );
}
