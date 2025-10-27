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
import { useEffect, useState, useCallback } from "react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Course from "@/lib/axios/course";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Semester from "@/lib/axios/semester";

// Form Schemas
const semesterSchema = z
  .object({
    description: z.string().min(1, "Description is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be greater than start date",
    path: ["end_date"],
  });

const registrationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be greater than start date",
    path: ["end_date"],
  });

export default function TeacherPage() {
  // Forms
  const semesterForm = useForm<z.infer<typeof semesterSchema>>({
    resolver: zodResolver(semesterSchema),
  });
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
  });

  // States
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [courses, setCourses] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any>([]);

  // Hooks
  const { data: semestersData, refetch: refetchSemesters } = SemesterQuery();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL Query String Helper
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Data Fetching Functions
  const fetchCourses = useCallback(async (semesterId: string) => {
    if (!semesterId) return;
    try {
      const response = await Course.GetAllCourse(semesterId);
      setCourses(response?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  const fetchRegistrations = useCallback(async (semesterId: string) => {
    if (!semesterId) return;
    try {
      const response = await Semester.GetDkmh(semesterId);
      setRegistrations(response?.data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  }, []);

  const fetchCurrentSemester = useCallback(async () => {
    try {
      const response = await Semester.GetSemesterByNow();
      if (response?.data?.id) {
        router.push(pathname + "?" + createQueryString("id", response.data.id));
      }
    } catch (error) {
      console.error("Error fetching current semester:", error);
    }
  }, [pathname, router, createQueryString]);

  // Effects
  useEffect(() => {
    const semesterId = searchParams.get("id");
    if (semesterId && semestersData?.data) {
      const semester = semestersData.data.find(
        (s: any) => s.id.toString() === semesterId
      );
      setSelectedSemester(semester || null);
    } else if (!semesterId) {
      fetchCurrentSemester();
    }
  }, [searchParams, semestersData, fetchCurrentSemester]);

  useEffect(() => {
    if (selectedSemester?.id) {
      fetchCourses(selectedSemester.id);
      fetchRegistrations(selectedSemester.id);
    }
  }, [selectedSemester, fetchCourses, fetchRegistrations]);

  // Form Submit Handlers
  const handleCreateSemester = async (data: z.infer<typeof semesterSchema>) => {
    try {
      const response: any = await Semester.CreateSemester(data);
      if (response?.success) {
        refetchSemesters();
        Swal.fire("Success", "Create semester success", "success");
      } else {
        Swal.fire("Error", "Create semester failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Create semester failed", "error");
    }
  };

  const handleCreateRegistration = async (
    data: z.infer<typeof registrationSchema>
  ) => {
    try {
      const payload = { ...data, id: selectedSemester?.id };
      const response: any = await Semester.CreateNewDKMH(payload);
      if (response?.success) {
        fetchRegistrations(selectedSemester.id);
        Swal.fire("Success", "Create registration period success", "success");
      } else {
        Swal.fire("Error", "Create registration period failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Create registration period failed", "error");
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    const result = await Swal.fire({
      title: "Do you want to delete?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      denyButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const response: any = await Semester.DeleteDKMH(id);
        if (response?.success) {
          fetchRegistrations(selectedSemester.id);
          Swal.fire("Saved!", response?.mess, "success");
        } else {
          Swal.fire("Error!", response?.mess, "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Delete failed", "error");
      }
    }
  };

  // Event Handlers
  const handleSemesterChange = (semesterId: string) => {
    router.push(pathname + "?" + createQueryString("id", semesterId));
  };

  return (
    <div className="flex justify-center flex-col items-center gap-5">
      {/* Header Section */}
      <div className="flex gap-5 items-center mt-5 lg:flex-row flex-col">
        <Select
          onValueChange={handleSemesterChange}
          value={selectedSemester?.id?.toString() || ""}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semestersData?.data?.map((semester: any) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSemester && (
          <div className="flex gap-4 sm:flex-row flex-col mb-3 sm:mb-0 items-center">
            From
            <Button variant="secondary">
              {TimeConvert(selectedSemester.start_date)}
            </Button>
            to
            <Button variant="secondary">
              {TimeConvert(selectedSemester.end_date)}
            </Button>

            {/* Registration Period Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button>Mở ĐKMH</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Đăng kí môn học</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the schedule for register course
                    </p>
                  </div>
                  <Form {...registrationForm}>
                    <form
                      onSubmit={registrationForm.handleSubmit(
                        handleCreateRegistration
                      )}
                      className="space-y-8"
                    >
                      <FormField
                        control={registrationForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="title">Title</Label>
                              <FormControl>
                                <Input
                                  id="title"
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
                        control={registrationForm.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="reg-start">Begin</Label>
                              <FormControl>
                                <Input
                                  type="date"
                                  id="reg-start"
                                  className="col-span-2 h-8"
                                  {...field}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const isoDate = new Date(
                                      e.target.value
                                    ).toISOString();
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
                        control={registrationForm.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="reg-end">End</Label>
                              <FormControl>
                                <Input
                                  type="date"
                                  id="reg-end"
                                  className="col-span-2 h-8"
                                  {...field}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const isoDate = new Date(
                                      e.target.value
                                    ).toISOString();
                                    field.onChange(isoDate);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-center">
                        <Button type="submit" variant="secondary">
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* No Semester Selected Alert */}
      {!selectedSemester && (
        <Alert className="w-[60%]">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Chưa chọn học kỳ</AlertTitle>
          <AlertDescription>
            Vui lòng chọn học kỳ để xem nội dung khóa học và thông tin liên quan.
          </AlertDescription>
        </Alert>
      )}

      {/* Content Section */}
      {selectedSemester && (
        <>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Drawer>
              <DrawerTrigger>
                <Button variant="outline" className="rounded-full">
                  Thêm học kì <FaPlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Tạo học kỳ mới</DrawerTitle>
                  <DrawerDescription>
                    Nhập thông tin học kỳ mới
                  </DrawerDescription>
                </DrawerHeader>
                <Form {...semesterForm}>
                  <form
                    onSubmit={semesterForm.handleSubmit(handleCreateSemester)}
                    className="space-y-8 px-5"
                  >
                    <FormField
                      control={semesterForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: Học kỳ 1 2024-2025" {...field} />
                          </FormControl>
                          <FormDescription>
                            Tên hiển thị của học kỳ
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={semesterForm.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày bắt đầu</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? new Date(field.value)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) => {
                                const isoDate = new Date(
                                  e.target.value
                                ).toISOString();
                                field.onChange(isoDate);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Ngày bắt đầu học kỳ
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={semesterForm.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày kết thúc</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? new Date(field.value)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) => {
                                const isoDate = new Date(
                                  e.target.value
                                ).toISOString();
                                field.onChange(isoDate);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Ngày kết thúc học kỳ
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3">
                      <Button type="submit">Submit</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </div>
                  </form>
                </Form>
                <DrawerFooter />
              </DrawerContent>
            </Drawer>

            <Link href={`/admin/courses/add?id=${selectedSemester.id}`}>
              <Button variant="outline" className="rounded-full">
                Thêm khóa học <FaPlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Registration Periods Accordion */}
          <Accordion type="single" collapsible className="sm:w-[60%] w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Đăng kí môn học</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3">
                  {registrations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có đợt đăng ký nào
                    </p>
                  ) : (
                    registrations.map((registration: any) => (
                      <Alert key={registration.id}>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>
                          <p className="flex justify-between items-center">
                            {registration.title}
                            <X
                              className="cursor-pointer hover:text-red-500"
                              onClick={() =>
                                handleDeleteRegistration(registration.id)
                              }
                            />
                          </p>
                        </AlertTitle>
                        <AlertDescription>
                          Thời gian: {TimeConvert(registration.start_date)} -{" "}
                          {TimeConvert(registration.end_date)}
                        </AlertDescription>
                      </Alert>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Courses Data Table */}
          {courses && (
            <DataTable
              columns={columns(fetchCourses, selectedSemester.id)}
              data={courses}
            />
          )}
        </>
      )}
    </div>
  );
}
