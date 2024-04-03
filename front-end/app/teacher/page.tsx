'use client'
import TextEditor from "../../components/TextEditor";
import ToggleTheme from "@/components/toggle-theme";
export default function TeacherPage() {
  return (
    <div>
      <ToggleTheme />
      <h1>Teacher Page</h1>
      <TextEditor/>
    </div>
  )
}