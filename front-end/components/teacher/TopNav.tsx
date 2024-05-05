"use client";
import { BlockLoading } from "../loading";
import UserQuery from "@/hooks/user";
import UserAvatar from "../common/UserAvatar";
import Link from "next/link";
import Image from "next/image";
import ToggleTheme from "../toggle-theme";
import deleteToken from "@/hooks/deleteToken";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { use } from "react";
export default function TopNav() {
  const router = useRouter();
  const path = usePathname();
  console.log(path);
  const { data, isPending, error } = UserQuery();
  if (isPending)
    return (
      <div className="m-auto w-screen flex justify-center items-center h-screen">
        <BlockLoading />
      </div>
    );
  if (error) return "An error has occurred ...";
  return (
    <div className="navbar bg-nav p-3 shadow-lg">
      <div className="navbar-start text-nav-text z-50">
        <div className="dropdown lg:hidden z-50">
          <div tabIndex={0} role="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow rounded-box w-52 z-50 bg-nav"
          >
            <li>
              <Link href={"/teacher"}>Trang chủ</Link>
            </li>
            <li>
              <Link href={"/teacher/course"}>Quản lý khóa học</Link>
            </li>
            <li>
              <Link href={"/teacher/schedule"}>Lịch dạy học</Link>
            </li>
            <li>
              <Link href={"/teacher/profile"}>Tài khoản</Link>
            </li>

            <li>
              <Button
                variant={"link"}
                onClick={async () => {
                  await deleteToken();
                  router.push("/login?admin=false");
                }}
              >
                Log out
              </Button>
            </li>
          </ul>
        </div>
        <div className="hidden lg:block">
          <Image src="/favicon.ico" alt="Logo" width={50} height={50} />
        </div>
        <a className="btn btn-ghost text-xl text-nav-text ">LMS</a>
      </div>
      <div className="navbar-center hidden lg:flex text-nav-text ">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/teacher"}>Trang chủ</Link>
          </li>
          <li>
            <Link href={"/teacher/course"}>Quản lý khóa học</Link>
          </li>
          <li>
            <Link href={"/teacher/profile"}>Tài khoản</Link>
          </li>
          <li>
            <Link href={"/teacher/schedule"}>Lịch dạy học</Link>
          </li>
          <li>
            <Button
              variant={"link"}
              onClick={async () => {
                await deleteToken();
                router.push("/login?admin=false");
              }}
            >
              Log out
            </Button>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-3">
        {path !== "/teacher" && <UserAvatar data={data?.data} />}
        <div className="text-nav-text">
          Welcome
          <p className="font-bold">
            {data?.data?.firstname} {data?.data?.lastname}
          </p>
        </div>
        <ToggleTheme />
      </div>
    </div>
  );
}
