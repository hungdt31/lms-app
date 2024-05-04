import { RxTextAlignLeft } from "react-icons/rx";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { LuBellRing } from "react-icons/lu";
import { TfiControlStop } from "react-icons/tfi";
import { SiGoogleclassroom } from "react-icons/si";
import { BsPersonFillCheck } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import deleteToken from "@/hooks/deleteToken";
import UserQuery from "@/hooks/user";
import { Button } from "../ui/button";
export default function TemporaryDrawer() {
  const path = usePathname();
  const router = useRouter();
  const { data } = UserQuery();
  const nav = [
    {
      name: "Trang chủ",
      path: "/student",
      icon: <FaHome />,
    },
    {
      name: "Bảng điều khiển",
      path: "/student/control",
      icon: <TfiControlStop />,
    },
    {
      name: "Khóa học",
      path: "/student/course",
      icon: <SiGoogleclassroom />,
    },
    {
      name: "Khóa học của tôi",
      path: "/student/my",
      icon: <BsPersonFillCheck />,
    },
  ];
  return (
    <div className="drawer lg:drawer-open z-50">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <label htmlFor="my-drawer-2">
          <RxTextAlignLeft size={35} />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu p-4 w-80 min-h-full text-nav-text bg-nav">
          {nav.map((el, index: any) => {
            return (
              <Link
                key={index}
                href={el.path}
                className={
                  path.indexOf(el.path) == 0 && el.path != "/student"
                    ? "font-extrabold"
                    : ""
                }
              >
                <li>
                  <a>
                    {el.icon} {el.name}
                  </a>
                </li>
              </Link>
            );
          })}
          <div className="flex gap-3 ml-3 mt-5 items-center mb-5">
            <img
              src={data?.data?.avatar}
              className="rounded-full w-[60px] h-[60px]"
            />
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-3">
                {data?.data?.username}{" "}
                <LuBellRing size={20} className="cursor-pointer" />
              </div>
              <Link href={"/student/profile"}>
                <p className="font-light underline cursor-pointer">
                  view profile
                </p>
              </Link>
            </div>
          </div>
          <Button
            onClick={async () => {
              await deleteToken();
              router.push("/login?admin=false");
            }}
          >
            Log out
          </Button>
        </ul>
      </div>
    </div>
  );
}
