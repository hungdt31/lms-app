"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Post from "@/lib/axios/post";
import { useEffect, useState } from "react";
import TimeConvert from "@/helpers/TimeConvert";
export default function Notice() {
  const [data, setData] = useState<any>([]);
  const fetchData = async () => {
    const res = await Post.GetNotificationByRole("STUDENT");
    console.log(res);
    setData(res?.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center pb-9">
      <h1 className="text-main dark:text-white text-2xl font-bold p-5 pt-9">
        Bảng tin
      </h1>
      <Accordion type="single" collapsible className="w-[80%]">
        {data?.map((item: any, index: any) => (
          <AccordionItem key={item.id} value={`item-${index + 1}`}>
            <AccordionTrigger className="text-lg">{item.name}</AccordionTrigger>
            <AccordionContent>
              {item?.posts?.map((post: any) => (
                <div
                  key={post.id}
                  className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg my-2 shadow-md"
                >
                  <h1 className="text-main dark:text-white font-bold text-lg">
                    {post.title}
                  </h1>
                  <p className="text-gray-500">
                    Bởi <a className="text-cyan-700">{post.sender}</a> -{" "}
                    {TimeConvert(post.createdAt)}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="mt-5"
                  />
                  <div className="flex justify-end mt-5">
                    <Button variant={"link"}>Thảo luận về chủ đề này</Button>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
