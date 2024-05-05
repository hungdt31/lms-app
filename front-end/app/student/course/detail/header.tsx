"use client";
import { Card, CardContent } from "@/components/ui/card";
import { StepBack, StepForward } from "lucide-react";
import { useState, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
const selection = [
  {
    title: "Khóa học",
    des: "Thông tin khóa học",
  },
  {
    title: "Điểm số",
    des: "Điểm số sinh viên",
  },
  {
    title: "Video",
    des: "Video môn học",
  },
];
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const index: string = searchParams.get("index") as string;
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  const [open, setOpen] = useState<Boolean>(true);
  return (
    <div>
      <div className="sm:flex justify-center flex-wrap gap-7 m-3 hidden">
        {selection.map((el, _index: any) => (
          <div
            key={_index}
            className="border-2 rounded-lg text-center px-9 py-3 text-nav-text bg-nav"
            onClick={() =>
              router.push(
                pathname + "?" + createQueryString("index", `${_index}`),
              )
            }
          >
            <p className={index == _index ? "font-bold" : ""}>
              {el.title}
              <br /> ({el.des})
            </p>
          </div>
        ))}
      </div>
      <div className="sm:hidden">
        {open ? (
          <div
            className="bg-nav text-nav-text rounded-full w-[50px] h-[50px] flex justify-center items-center fixed top-[30%] left-2 z-50 hover:brightness-125"
            onClick={() => setOpen(!open)}
          >
            <StepForward />
          </div>
        ) : (
          <div className="relative">
            <Card className="fixed top-[18%] left-7 z-50">
              <CardContent className="p-0">
                {selection.map((el, __index: any) => (
                  <div
                    key={__index}
                    className="border-b-2 px-5 py-3 cursor-pointer"
                    onClick={() =>
                      router.push(
                        pathname +
                          "?" +
                          createQueryString("index", `${__index}`),
                      )
                    }
                  >
                    <p>
                      <p className={index == __index ? "font-bold" : ""}>
                        {el.des}{" "}
                      </p>
                    </p>
                  </div>
                ))}
              </CardContent>
              <StepBack
                className="absolute top-[45%] -right-3"
                onClick={() => setOpen(!open)}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
