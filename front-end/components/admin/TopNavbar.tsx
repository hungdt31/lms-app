"use client";
import nav from "@/helpers/AdminNav";
import Link from "next/link";
import React from "react";
import { LayoutList } from "lucide-react";
import { usePathname } from "next/navigation";
import ToggleTheme from "../toggle-theme";
export default function TopNavbar() {
  const pathname = usePathname();
  const [show, setShow] = React.useState<boolean>(false);
  return (
    <div className="sm:hidden shadow-lg bg-nav">
      <div className="p-5 flex justify-between items-center">
        <LayoutList onClick={() => setShow(!show)} className="text-nav-text"/>
        <ToggleTheme />
      </div>
      <hr />
      <div className="flex gap-3 flex-wrap font-bold text-nav-text">
        {show &&
          nav.map((item: any) => {
            return (
              <Link
                href={item.href}
                key={item.title}
                className={pathname === item.href ? "underline" : ""}
              >
                <div key={item.title} className="p-3">
                  <div className="flex items-center">
                    <p>{item?.title}</p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
