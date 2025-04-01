"use client";
import ToggleTheme from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import _Image from "../favicon.png";
import Image from "next/image";

export default function NavLayout() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Gradient Background */}
      <div className="shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[70px]">
            {/* Logo Section */}
            <Link
              href={"/"}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative w-[45px] h-[45px] overflow-hidden">
                <Image
                  src={_Image}
                  alt="Logo"
                  width={45}
                  height={45}
                  className="rounded-lg shadow-sm object-cover transform hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-2xl ">LMS</p>
                <p className="text-xs">Learning Management System</p>
              </div>
            </Link>

            {/* Navigation Items */}
            {/* <div className="hidden md:flex items-center space-x-6">
              <Link href="/courses" className="text-blue-100 hover: transition-colors">
                Courses
              </Link>
              <Link href="/about" className="text-blue-100 hover: transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-blue-100 hover: transition-colors">
                Contact
              </Link>
            </div> */}

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-white/10  hover:bg-white/20 transition-colors px-4 py-2 rounded-lg"
                  >
                    Login
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 p-2">
                  <DropdownMenuItem
                    onClick={() => router.push("/login?admin=false")}
                    className="hover:bg-blue-50 rounded-md transition-colors py-2"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Student / Teacher
                    </div>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/login?admin=true")}
                    className="hover:bg-blue-50 rounded-md transition-colors py-2"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Admin
                    </div>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border-l border-blue-400 h-6 mx-2"></div>

              <ToggleTheme />
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Subtle shadow/line below nav */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"></div>
    </nav>
  );
}
