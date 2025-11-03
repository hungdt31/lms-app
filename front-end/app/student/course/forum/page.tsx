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
    <div className="px-3 pb-12">
      <div className="mx-auto lg:w-[60%] w-[90%]">
        <div className="mb-4">
          <h1 className="font-bold text-3xl tracking-tight text-foreground">
            {forum?.title}
          </h1>
          <div className="h-1 w-20 bg-yellow-500 rounded mt-1" />
        </div>
        {forum?.threads && forum?.threads?.length ? (
          <ThreadTable columns={thread_columns} data={forum?.threads} />
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6M4 6a2 2 0 012-2h12a2 2 0 012 2v12l-4-3H6a2 2 0 01-2-2V6z" />
            </svg>
            <p className="font-medium">Chưa có chủ đề nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
