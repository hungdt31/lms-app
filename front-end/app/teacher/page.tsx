"use client";
import Image from "next/image";
import teaching_image from "./teaching_image.jpg";
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
export default function StudentPage() {
  const [data, setData] = useState<any>([]);
  const fetchData = async () => {
    const res = await Post.GetNotificationByRole("TEACHER");
    console.log(res);
    setData(res?.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="flex gap-5 px-7 items-center flex-col sm:flex-row py-5">
        <Image
          className="rounded-lg"
          src={teaching_image}
          quality={100}
          style={{
            objectFit: "cover",
          }}
          width={500}
          height={500}
          placeholder="blur"
          alt="Picture of the author"
        />

        <figure className="max-w-screen-md mx-auto text-center">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
          <blockquote>
            <p className="text-2xl italic font-medium text-gray-900 dark:text-white">
              &quot;Chỉ yêu thương trẻ nhỏ là không đủ đối với người giáo viên.
              Người giáo viên đầu tiên phải yêu và thấu hiểu vạn vật, phải chuẩn
              bị cho bản thân, và thực sự nỗ lực vì điều đó.&quot;
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
            <img
              className="w-6 h-6 rounded-full"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Maria_Montessori1913.jpg/375px-Maria_Montessori1913.jpg"
              alt="profile picture"
            />
            <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500 dark:divide-gray-700">
              <cite className="pe-3 font-medium text-gray-900 dark:text-white">
                Maria Montessori
              </cite>
              <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                Nhà giáo dục người Ý
              </cite>
            </div>
          </figcaption>
        </figure>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-main dark:text-white text-2xl font-bold p-5 pt-9">
          Bảng tin
        </h1>
        <Accordion type="single" collapsible className="w-[80%]">
          {data?.map((item: any, index: any) => (
            <AccordionItem key={item.id} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-lg">
                {item.name}
              </AccordionTrigger>
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
    </div>
  );
}
