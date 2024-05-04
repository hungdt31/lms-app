"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
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
const FormSchema2 = z
  .object({
    title: z.string().min(1, {
      message: "Title is required",
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
  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
  });
  const [dkmh, setDkmh] = useState<any>([]);
  const [trigger, setTrigger] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const semes = SemesterQuery();
  console.log(semes);
  const [info, setInfo] = useState<any>(null);
  const [fet, setFet] = useState<any>(null);
  const fetchCourse = async (id: any) => {
    const course = await Course.GetAllCourse(id);
    setCourse(course?.data);
    console.log(course);
  };
  const fetchDKMH = async (id: any) => {
    const dkmh = await Semester.GetDkmh(id);
    setDkmh(dkmh?.data);
  };
  useEffect(() => {
    setInfo(trigger);
    // console.log(el);
    setFet(trigger?.id);
    fetchCourse(trigger?.id);
  }, [trigger]);
  useEffect(() => {
    fetchDKMH(fet);
  }, [fet]);
  const deleteDKMH = async (id: any) => {
    console.log(id);
    Swal.fire({
      title: "Do you want to delete ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes. delete it!",
      denyButtonText: `No`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const rs: any = await Semester.DeleteDKMH(id);
        if (rs?.success) {
          fetchDKMH(fet);
          Swal.fire("Saved!", rs?.mess, "success");
        } else Swal.fire("Error!", rs?.mess, "error");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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
  async function onSubmit2(data: any) {
    //console.log(data);
    data.id = fet;
    const res: any = await Semester.CreateNewDKMH(data);
    //console.log(res);
    if (res?.success) {
      fetchDKMH(fet);
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
            setTrigger(el);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semes?.data?.data?.map((el: any, index: any) => {
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
            <Popover>
              <PopoverTrigger asChild>
                <Button>Mở ĐKMH</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Đăng kí môn học
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Set the schedule for register course
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Form {...form2}>
                      <form
                        onSubmit={form2.handleSubmit(onSubmit2)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form2.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Title</Label>
                                <FormControl>
                                  <Input
                                    id="width"
                                    className="col-span-2 h-8"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form2.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Begin</Label>
                                <FormControl>
                                  <Input
                                    type="date"
                                    id="maxWidth"
                                    className="col-span-2 h-8"
                                    placeholder="shadcn"
                                    {...field}
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                            .toISOString()
                                            .split("T")[0]
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const date = new Date(e.target.value);
                                      const isoDate = date.toISOString();
                                      field.onChange(isoDate);
                                    }}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form2.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Begin</Label>
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
                                    id="maxWidth"
                                    className="col-span-2 h-8"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center">
                          <Button type="submit" variant={"secondary"}>
                            Submit
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {info && (
        <div className="flex items-center gap-3">
          <Drawer>
            <DrawerTrigger>
              <Button variant="outline" className="rounded-full">
                Thêm học kì <FaPlusCircle className="ml-2 h-4 w-4" />
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
              Thêm khóa học <FaPlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
      <Accordion type="single" collapsible className="sm:w-[60%] w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Đăng kí môn học</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              {dkmh?.map((el: any, index: any) => {
                return (
                  <Alert key={index}>
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>
                      <p className="flex justify-between items-center">
                        {el?.title}{" "}
                        <X
                          onClick={() => {
                            deleteDKMH(el?.id);
                          }}
                        />
                      </p>
                    </AlertTitle>
                    <AlertDescription>
                      Thời gian: {TimeConvert(el?.start_date)} -{" "}
                      {TimeConvert(el?.end_date)}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {course && (
        <DataTable columns={columns(fetchCourse, fet)} data={course} />
      )}
    </div>
  );
}
