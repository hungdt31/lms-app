"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import TimeConvert from "@/helpers/TimeConvert";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaPlusCircle } from "react-icons/fa";
import SemesterQuery from "@/hooks/semester";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Course from "@/lib/axios/course";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Semester from "@/lib/axios/semester";
const FormSchema = z
  .object({
    description: z.string().min(1, {
      message: "Description is required",
    }),
    start_date: z.string().min(1, {
      message: "Start date is required",
    }),
    end_date: z.string().min(1, {
      message: "End date is required",
    }),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be greater than start date",
    path: ["end_date"], // specify the field that the error is attached to
  });
export default function TeacherPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [course, setCourse] = useState<any>(null);
  const semes = SemesterQuery();
  const [info, setInfo] = useState<any>(null);
  const [fet, setFet] = useState<any>(null);
  const fetchCourse = async (id: any) => {
    const course = await Course.GetAllCourse(id);
    setCourse(course?.data);
    console.log(course);
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    //console.log(data);
    const res: any = await Semester.CreateSemester(data);
    //console.log(res);
    if (res?.success) {
      semes.refetch();
      Swal.fire("Success", "Create semester success", "success");
    } else {
      Swal.fire("Error", "Create semester failed", "error");
    }
  }
  // console.log(mutation);
  return (
    <div className="flex justify-center flex-col items-center gap-5">
      <div className="flex gap-5 items-center mt-5 lg:flex-row flex-col">
        <Select
          onValueChange={(el: any) => {
            setInfo(el);
            // console.log(el);
            setFet(el?.id);
            fetchCourse(el?.id);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semes?.data?.data?.map((el: any) => {
              return <SelectItem value={el}>{el?.description}</SelectItem>;
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
      {info && (
        <div className="flex items-center gap-3">
          <Drawer>
            <DrawerTrigger>
              <Button variant="outline" className="rounded-full">
                Add Semester <FaPlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-5"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="shadcn"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            type="date"
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              const isoDate = date.toISOString();
                              field.onChange(isoDate);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="shadcn"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            type="date"
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              const isoDate = date.toISOString();
                              field.onChange(isoDate);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mr-3">Submit</Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </form>
              </Form>
              <DrawerFooter></DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Link href={`/admin/courses/add?id=${info?.id}`}>
            <Button variant="outline" className="rounded-full">
              Add Course <FaPlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
      {course && (
        <DataTable columns={columns(fetchCourse, fet)} data={course} />
      )}
    </div>
  );
}
