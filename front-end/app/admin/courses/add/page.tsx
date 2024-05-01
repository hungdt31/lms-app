"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CirclePlus, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MdAddBox } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { RiErrorWarningFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Course from "@/lib/axios/course";
import Cate from "@/lib/axios/cate";
import Link from "next/link";
import Semester from "@/lib/axios/semester";
import Cookies from "universal-cookie";
import User from "@/lib/axios/user";
const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  course_id: z.string().min(1, {
    message: "Course ID is required",
  }),
  date: z.string().min(1, {
    message: "Date is required",
  }),
  time: z.string().min(1, {
    message: "Time is required",
  }),
  file: z.instanceof(File, {
    message: "Image is required",
  }),
  credit: z
    .number()
    .min(1, {
      message: "Min credit is 1",
    })
    .max(4, {
      message: "Max credit is 4",
    }),
  quantity: z
    .number()
    .min(30, {
      message: "Min is 30",
    })
    .max(100, {
      message: "Max is 100",
    }),
});

export default function AddCoursePage() {
  const { toast } = useToast();
  const token = new Cookies().get("token");
  // const [open, setOpen] = useState<any>(false);
  const [new_cate, setNew_cate] = useState<any>("");
  const [schedule, setSchedule] = useState<any>([]);
  const [week_array, setWeek_array] = useState<any>([]);
  const [teacherList, setTeacherList] = useState<any>([]);
  const [teacherId, setTeacherId] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const id: string = useSearchParams().get("id") as string;
  const router = useRouter();
  const [cate, setCate] = useState<any>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "Shadcn UI",
      description: "Shadcn",
      course_id: "",
      categoryId: "",
      date: "Monday",
      time: "",
      credit: 1,
      quantity: 30,
    },
  });
  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const time = [
    {
      des: "Tiết 1 - 3",
      value: "7:00 - 9:00",
    },
    {
      des: "Tiết 4 - 6",
      value: "9:30 - 11:30",
    },
    {
      des: "Tiết 7 - 9",
      value: "13:00 - 15:00",
    },
    {
      des: "Tiết 10 - 12",
      value: "15:30 - 17:30",
    },
    {
      des: "Tiết 13 - 15",
      value: "18:00 - 20:00",
    },
  ];
  useEffect(() => {
    Promise.all([
      Cate.GetAllCate(),
      Semester.GetNumWeek(id),
      User.GetTeacherList(token),
    ])
      .then(([cateRes, semesterRes, teacherRes]) => {
        // Handle results
        setCate(cateRes?.data);
        setWeek_array(
          Array.from({ length: semesterRes?.data }, (_, i) => i + 1),
        );
        // console.log(teacherRes?.data);
        setTeacherList(teacherRes?.data);
      })
      .catch((error) => {
        // handle error
        console.error(error);
      });
  }, []);
  async function onSubmit(data: any) {
    setLoading(true);
    data.semesterId = id;
    if (teacherId !== "") data.teacherId = teacherId;
    if (schedule.length !== 0) data.schedule = schedule;
    await Course.AddCourse(data).then((res: any) => {
      setLoading(false);
      if (res?.success) {
        toast({
          title: "Success",
          description: "Course added successfully",
        });
        router.push("/admin/courses");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    });
    //console.log(data);
  }

  return (
    <div className="py-5">
      <div className="flex gap-7 m-auto flex-col mt-[40px]">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex gap-3 items-center font-bold underline ">
            <MdAddBox size={24} />
            <p>ADD COURSE</p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course Title</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input className="col-span-7" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Category </FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <CirclePlus />
                      </PopoverTrigger>
                      <PopoverContent>
                        <Label className="font-light">ADD NEW CATEGORY</Label>
                        <div className="flex gap-3 items-center mt-5">
                          <Input
                            value={new_cate}
                            onChange={(e) => setNew_cate(e.target.value)}
                          />
                          <Button
                            variant={"secondary"}
                            className="rounded-full"
                            onClick={() => {
                              Cate.AddCate({ name: new_cate }).then(
                                (res: any) => {
                                  if (res?.success) {
                                    toast({
                                      title: "Success",
                                      description:
                                        "Category added successfully",
                                    });
                                    Cate.GetAllCate().then((res) => {
                                      setCate(res?.data);
                                    });
                                  } else {
                                    toast({
                                      title: "Error",
                                      description: "Something went wrong",
                                    });
                                  }
                                },
                              );
                            }}
                          >
                            <Check />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: any) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {cate?.map((el: any) => {
                            return (
                              <SelectItem value={el?.id}>{el?.name}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course ID</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input className="col-span-4" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credit"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Credit</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-4"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      The numbers of member
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-4"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course Description</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="col-span-8" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Date</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: any) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                        <SelectContent>
                          {week?.map((el: any) => {
                            return <SelectItem value={el}>{el}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Time</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: any) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select study time" />
                        </SelectTrigger>
                        <SelectContent>
                          {time?.map((el: any) => {
                            return (
                              <SelectItem value={el.value}>
                                {el.des} ({el.value})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Image</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-8 items-center p-0 pt-1.5"
                        type="file"
                        onChange={(e: any) =>
                          form.setValue("file", e.target.files[0])
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <div className="mt-5">
              <FormLabel>Week: [{schedule?.join(", ")}]</FormLabel>
              <div className="flex items-center gap-3 flex-wrap mt-3">
                {week_array?.map((el: any) => {
                  return (
                    <Badge
                      key={el}
                      variant={schedule.includes(el) ? "default" : "secondary"}
                      onClick={() => {
                        console.log(schedule);
                        if (schedule.includes(el)) {
                          setSchedule(
                            schedule.filter((item: any) => item !== el),
                          );
                        } else {
                          setSchedule([...schedule, el]);
                        }
                      }}
                    >
                      {el}
                    </Badge>
                  );
                })}
              </div>
              <div className="flex gap-3 items-center mt-5">
                <FormLabel>Lecturer</FormLabel>
                <Select onValueChange={(e) => setTeacherId(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {teacherList?.map((el: any) => {
                        return (
                          <SelectItem
                            value={el?.id}
                            className="flex items-center"
                          >
                            <Avatar>
                              <AvatarImage src={el?.avatar} />
                              <AvatarFallback>
                                {el?.firstname[0]} {el?.lastname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>
                                {el?.firstname} {el?.lastname}
                              </p>
                              <div className="text-sm text-gray-500">
                                {el?.email}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex w-full justify-end gap-4">
              <Link href="/admin/courses">
                <Button variant="outline">Cancel</Button>
              </Link>
              {!loading && <Button type="submit">Save</Button>}
              {loading && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
