"use client";
import Link from "next/link";
import { BlockLoading } from "@/components/loading";
import Cookies from "universal-cookie";
import { FaAngleDown } from "react-icons/fa6";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import ToggleTheme from "@/components/toggle-theme";
import { useRouter, usePathname } from "next/navigation";
import TemporaryDrawer from "@/components/drawer";
import UserQuery from "@/hooks/user";
import deleteToken from "@/hooks/deleteToken";
export default function NavLayout() {
  // const cookies = new Cookies();
  const router = useRouter();
  const { data, isPending, error } = UserQuery();
  const path = usePathname();
  const nav = [
    {
      name: "Trang chủ",
      path: "/student",
    },
    {
      name: "Bảng điều khiển",
      path: "/student/control",
    },
    {
      name: "Khóa học",
      path: "/student/dkmh",
    },
    {
      name: "Khóa học của tôi",
      path: "/student/my",
      path2: "/student/course",
    },
  ];

  if (isPending)
    return (
      <div className="m-auto w-screen flex justify-center items-center h-screen">
        <BlockLoading />
      </div>
    );
  if (error) return "An error has occurred ...";
  return (
    <div className="flex flex-col gap-3 mb-7">
      <div className="fixed bottom-5 right-5">
        <ToggleTheme />
      </div>
      <div className="flex bg-nav justify-between py-5 items-center shadow-lg px-5 text-nav-text">
        <div className="gap-5 flex items-center">
          <Link href={"/"} className="flex items-center gap-5">
            <Layers size={50}/>
            <div>
              <p className="font-bold text-2xl">LMS </p>
              <p>
                Welcome,{" "}
                <b>{data?.data?.lastname + " " + data?.data?.firstname} </b> !
              </p>
            </div>
          </Link>
        </div>
        <div className="sm:hidden">
          <TemporaryDrawer />
        </div>
        <div className="sm:flex gap-5 items-center hidden">
          {nav.map((el) => {
            return (
              <Link
                href={el.path}
                className={
                  (path.indexOf(el.path) == 0 && el.path != "/student" ) || (el?.path2 && path.indexOf(el.path2) == 0 && el.path != "/student") 
                    ? "font-bold"
                    : "" 
                }
              >
                {el.name}
              </Link>
            );
          })}
          <UserAvatar data={data?.data} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <motion.div
                whileHover={{
                  scale: 1.5,
                  transition: { duration: 1 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FaAngleDown />
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/student/profile"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Notice</DropdownMenuItem>
              <Link href={"/student/semester"}>
              <DropdownMenuItem>Result</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={async () => {
                  await deleteToken();
                  router.push("/login?admin=false");
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
