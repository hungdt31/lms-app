"use client";
import Course from "@/lib/axios/course";
import Cookies from "universal-cookie";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BlockLoading } from "@/components/loading";
import { useMutation } from "@tanstack/react-query";
import Cate from "@/lib/axios/cate";
import MediaCard from "@/components/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Semester from "@/lib/axios/semester";
export default function MyPage() {
  const cookies = new Cookies();
  const token = cookies.get("token") ?? null;
  const [name, setName] = useState<any>("");
  const [page, setPage] = useState<any>(1);
  const [count, setCount] = useState<any>(0);
  const [courseData, setCourseData] = useState<any>(null);
  const [cate_id, setCate_id] = useState<any>("all");
  const [semester_id, setSemester_id] = useState<any>("all");
  const [name_sort, setName_Sort] = useState<any>("asc");
  const [cate, setCate] = useState<any>(null);
  const [semester, setSemester] = useState<any>(null);
  const ref = useRef<any>(null);
  const fecthCourse = async (data: any) => {
    const course = await Course.GetAllSubscribedCourse(data);
    return course;
  };
  const course: any = useMutation({
    mutationKey: ["courseData"],
    mutationFn: (data: any) => fecthCourse(data),
  });
  const fetchCate = async () => {
    const cate = await Cate.GetAllCate();
    setCate(cate?.data);
  };
  const fetchSemester = async () => {
    const semester = await Semester.GetAllSemester();
    setSemester(semester?.data);
  };
  const fetchSemesterByNow = async () => {
    const semester = await Semester.GetSemesterByNow();
    if (semester?.data) setSemester_id(semester?.data?.id);
  };
  useEffect(() => {
    Promise.all([fetchCate(), fetchSemester(), fetchSemesterByNow()])
      .then(([cateResult, semesterResult, SemesterByNowResult]) => {
        // Handle results
        console.log("Done !");
      })
      .catch((error) => {
        // Handle error
        console.log("Error !");
      });
  }, []);
  // useEffect(() => {
  //   const obj = {
  //     name,
  //     cate_id,
  //     semester_id,
  //     name_sort,
  //   };
  //   course.mutate({
  //     name,
  //     cate_id,
  //     semester_id,
  //     name_sort,
  //     token,
  //     page,
  //   });
  //   console.log(obj);
  // }, [name_sort, name, cate_id, semester_id, page]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const obj = {
        name,
        cate_id,
        semester_id,
        name_sort,
      };
      course.mutate({
        name,
        cate_id,
        semester_id,
        name_sort,
        token,
        page,
      });
      console.log(obj);
    }, 500); // Delay of 0.5 second

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [name_sort, name, cate_id, semester_id, page]);
  useEffect(() => {
    // console.log(course?.data?.data);
    setCourseData(course?.data?.data?.course);
    setCount(course?.data?.data?.count);
    if (course?.data?.data?.count < page) setPage(1);
    const input = ref.current;
    if (input) input.value = name;
  }, [course?.data?.data]);
  if (course.isPending)
    return (
      <div className="m-auto w-screen flex justify-center items-center h-screen">
        <BlockLoading />
      </div>
    );
  if (course.error) return "An error has occurred ...";

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center p-5">
        <Input
          placeholder="Tìm kiếm khóa học"
          onChange={(e) => {
            setName(e?.target?.value);
          }}
          ref={ref}
          className="w-[400px]"
        />
        <Select onValueChange={(e) => setSemester_id(e)} value={semester_id}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semester</SelectLabel>
              {semester?.map((el: any, index: any) => {
                return (
                  <SelectItem value={el?.id} key={index}>
                    {el?.description}
                  </SelectItem>
                );
              })}
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(e) => setCate_id(e)} value={cate_id}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {cate?.map((el: any, index: any) => {
                return (
                  <SelectItem value={el?.id} key={index}>
                    {el?.name}
                  </SelectItem>
                );
              })}
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger>
            <Button variant={"secondary"}>Sắp xếp</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Button
              variant={"link"}
              onClick={() => {
                setName_Sort("asc");
              }}
            >
              Tăng dần theo tên {name_sort === "asc" ? "✔" : ""}
            </Button>
            <Button
              variant={"link"}
              onClick={() => {
                setName_Sort("desc");
              }}
            >
              Giảm dần theo tên {name_sort === "desc" ? "✔" : ""}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-5 px-5 flex-wrap">
        {courseData?.map((el: any, index: number) => {
          return <MediaCard key={index}>{el}</MediaCard>;
        })}
      </div>
      <Pagination className="pb-5 pt-7">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page - 1 < 1 ? page : page - 1)}
            />
          </PaginationItem>
          {Array.from({ length: count }, (_, i) => (
            <PaginationItem key={i}>
              {i + 1 == page ? (
                <Button onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ) : (
                <Button onClick={() => setPage(i + 1)} variant={"secondary"}>
                  {i + 1}
                </Button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page + 1 > count ? page : page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
