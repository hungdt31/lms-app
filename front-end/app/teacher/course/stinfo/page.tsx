"use client"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import QuizResult from "@/components/teacher/QuizResult"
import TotalPoint from "@/components/teacher/TotalPoint"
import Submission from "@/components/teacher/Submission"
const nav = [
  {
    title: "Bài nộp",
    icon: ""
  },
  {
    title: "Điểm tổng kết môn học",
    icon: ""
  },
  {
    title: "Điểm quiz",
    icon: ""
  },
]

export default function Stinfo() {
  const id : string = useSearchParams().get("id") as string
  const cid : string = useSearchParams().get("cid") as string
  const [index, setIndex] = useState<Number>(0)
  const selectPage = (index: Number) => {
    switch (index) {
      case 0:
        return <Submission cid={cid} uid={id}/>
      case 1:
        return <TotalPoint cid={cid} uid={id}/>
      case 2:
        return <QuizResult cid={cid} uid={id}/>
      default: 
        return <QuizResult cid={cid} uid={id}/>
    }
  }
  return (
    <div>
      {/* {id}
      {cid} */}
      <div className="flex justify-center items-center gap-7 mt-5 font-bold text-xl flex-wrap">
        {
          nav?.map((el: any, i: Number) => {
            return (
              <Button className="p-7 shadow-md" variant={index == i ? "default": "secondary"} onClick={() => setIndex(i)}>
                {el?.title}
              </Button>
            )
          })
        }
      </div>
      <div className="mt-5 flex justify-center">
        {selectPage(index)}
      </div>
    </div>
  )
}