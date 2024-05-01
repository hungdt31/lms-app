"use client";
import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Post from "@/lib/axios/post";
import ThreadTable from "./DataTable";
import { thread_columns } from "@/helpers/Column";
export default function ForumPage() {
  const id: any = useSearchParams().get("id");
  const [forum, setForum] = useState<any>(null);
  const fetchData = async () => {
    const res = await Post.GetForum(id);
    console.log(res);
    setForum(res?.data);
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  return (
    <div className="px-3">
      <div className="">
        <p className="h-[3px] w-[50px] bg-yellow-500 ml-auto"></p>
        <h1 className="font-bold text-2xl border-l-2 border-yellow-500 border-r-2 px-3">
          {forum?.title}
        </h1>
        <p className="h-[3px] w-[50px] bg-yellow-500"></p>
      </div>
      {forum?.threads && (
        <ThreadTable columns={thread_columns} data={forum?.threads} />
      )}
    </div>
  );
}
