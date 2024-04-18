"use client"
import { useSearchParams } from "next/navigation"
import Quiz from "@/lib/axios/quiz"
import { useEffect, useState } from "react"
export default function ResultPage() {
  const [result, setResult] = useState<any>(null)
  const id : string = useSearchParams().get("id") as string
  console.log(id)
  const fetchResult = async() => {
    const rs = await Quiz.GetResult(id)
    console.log(rs)
    setResult(rs?.data)
  }
  useEffect(() => {
    fetchResult()
  },[])
  return (
    <div>
      <p>Result Page</p>
      <p>Điểm thi: {result?.score}</p>
    </div>
  )
}