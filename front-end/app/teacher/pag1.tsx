'use client'
import Image from "next/image";
import yard from "../../public/friend.jpg";
import TextEditor from "../../components/TextEditor";
import ToggleTheme from "@/components/toggle-theme";
import Cate from "@/lib/axios/cate";
import { useEffect } from "react";
export default function TeacherPage() {
  useEffect(() => {
    Cate.GetAllCate().then((res) => {
      console.log(res.data);
    });
  },[])
  return (
    <div className="flex gap-5 px-7 items-center flex-col sm:flex-row">
      <Image
        className="rounded-lg"
        src={yard}
        quality={100}
        style={{
          objectFit: "cover",
        }}
        width={500}
        height={500}
        placeholder="blur"
        alt="Picture of the author"
      />
      {/*
      <ToggleTheme />
      <h1>Teacher Page</h1>
      <TextEditor/>
      */}
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
            "Nhà trường chỉ cho chúng ta chiếc chìa khóa tri thức, học trong
            cuộc sống là công việc cả đời."
          </p>
        </blockquote>
        <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
          <img
            className="w-6 h-6 rounded-full"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/375px-Bill_Gates_2018.jpg"
            alt="profile picture"
          />
          <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500 dark:divide-gray-700">
            <cite className="pe-3 font-medium text-gray-900 dark:text-white">
              Bill Gates
            </cite>
            <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
              Chủ tịch tập đoàn Microsoft
            </cite>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}
