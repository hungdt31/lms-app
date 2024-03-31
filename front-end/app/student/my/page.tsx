"use client";
import Course from "@/lib/axios/course";
import Cookies from "universal-cookie";
import { BlockLoading } from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import MediaCard from "@/components/card";
export default function MyPage() {
  const cookies = new Cookies();
  const token = cookies.get("token") ?? null;
  const fecthCourse = async () => {
    const course = await Course.GetAllSubscribedCourse(token);
    return course;
  };
  const course: any = useQuery({
    queryKey: ["courseData"],
    queryFn: fecthCourse,
  });
  if (course.isPending)
    return (
      <div className="m-auto w-screen flex justify-center items-center h-screen">
        <BlockLoading />
      </div>
    );
  if (course.error) return "An error has occurred ...";
  return (
    <div>
      <div className="flex gap-5 px-5 flex-wrap">
        {course?.data?.data?.map((el: any, index: number) => {
          return <MediaCard children={el} />;
        })}
      </div>
    </div>
  );
}
