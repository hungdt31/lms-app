'use client'
import { useSearchParams } from "next/navigation"
import { CourseQuery } from "@/hooks/course";
export default function DetailCourse(){ 
  const course_id : string = useSearchParams().get("id") as string;
  const {data} = CourseQuery(course_id);
  return (
    <div>
      <div className = "m-auto w-screen flex justify-center items-center v-screen text-3xl">{data?.data?.title} - {data?.data?.course_id}</div>
      <br/>
      <div className = "gap-x-[1%] m-auto w-screen flex justify-center items-center v-screen">
        <a  href={`../course/detail?id=${course_id}`} className="bg-[rgb(0,126,189)] h-[80px] rounded-lg p-5 lg:w-[20%] sm:w-[15%] relative w-[100%] shadow-xl border-gray-600 btn btn-info"> 
          <p className= "text-white">Khóa học <br/> (Thông tin khóa học)</p>
        </a>
  
      </div>

    </div>
)
}
