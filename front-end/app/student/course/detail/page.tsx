'use client'
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";

export default function DetailCourse(){
  const course_id : string = useSearchParams().get("id") as string;
  const {data} = CourseQuery(course_id);
  console.log(data);
  return (
    <div>
      <div className = "m-auto w-screen flex justify-center items-center v-screen text-3xl">{data?.data?.title} - {data?.data?.course_id}</div>
      <br/>
      <div className = "gap-x-[1%] m-auto w-screen flex justify-center items-center v-screen">
        <a  className="bg-[rgb(0,126,189)] h-[80px] rounded-lg p-5 lg:w-[20%] sm:w-[15%] relative w-[100%] shadow-xl border-gray-600 btn btn-info"> 
          <p className= "text-white">Khóa học <br/> (Thông tin khóa học)</p>
        </a>

        <a href={`../course/grade?id=${course_id}`} className="bg-[rgb(0,126,189)] h-[80px] rounded-lg p-5 lg:w-[20%] sm:w-[15%] relative w-[100%] shadow-xl border-gray-600 btn btn-info"> 
          <p className= "text-white">Điểm số <br/> (Điểm số sinh viên)</p>
        </a>

        <a href={`../course/video?id=${course_id}`} className="bg-[rgb(0,126,189)] h-[80px] rounded-lg p-5 lg:w-[20%] sm:w-[15%] relative w-[100%] shadow-xl border-gray-600 btn btn-info"> 
        <p className= "text-white">Video <br/> (Video môn học)</p>
        </a>
  
      </div>
      <br/>
      
      <div>
        {data?.data?.DocumentSections?.map((el: any, index: any)=>(
          <div key = {index}>
            <div className="m-auto w-screen justify-center items-center v-screen collapse collapse-arrow border border-gray-600 lg:w-[50%]  shadow-xl">
              <input type="checkbox" /> 
              <div className="collapse-title text-xl font-medium ">
                <div>{el?.title}</div>
              </div>
              <ul className="menu collapse-content flex justify-center items-center v-screen w-[100%]"> 
                <div>
                {el?.documentLink?.map((DocLink: any, idx: any)=>(
                <button onClick={() => window.open(DocLink?.url)} key = {idx} className="w-[700px] border border-gray-600 rounded-lg p-1">
                  <div>LINK TÀI LIỆU: <div className = "text-[rgb(0,0,255)]">{DocLink?.description}</div></div>
                </button>
                ))} </div>
                <br/>
                <div>
                {el?.quiz?.map((Quiz: any, idx: any)=>(
                <button onClick={() => open(`../course/quiz?id=${Quiz?.id}`)} key = {idx} className="w-[700px] border border-gray-600 rounded-lg p-1">
                  <div>LINK QUIZ: <div className = "text-[rgb(255,0,0)]">{Quiz?.title}</div></div>
                </button>
                ))}</div>
                <br/>
                <div>
                {el?.submissions?.map((Submission: any, idx: any)=>(
                <button onClick={() => open(`../course/submission?id=${Submission?.id}`)} key = {idx} className="w-[700px] border border-gray-600 rounded-lg p-1">
                  <div>LINK Submission: <div className = "text-[rgb(255,0,0)]">{Submission?.title}</div></div>
                </button>
                ))}</div>
              </ul>
            </div>
          </div>
        ))}
      </div>
      </div>
)
}