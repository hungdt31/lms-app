"use client";
import TextEditor from "../../components/TextEditor";
import ToggleTheme from "@/components/toggle-theme";
import Cate from "@/lib/axios/cate";
import { useEffect } from "react";
export default function TeacherPage() {
  useEffect(() => {
    Cate.GetAllCate().then((res) => {
      console.log(res.data);
    });
  }, []);
  return (
    <div>
      <h1>Teacher Page</h1>
    </div>
  );
}
