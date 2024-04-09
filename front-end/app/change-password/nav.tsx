"use client"
import ToggleTheme from "@/components/toggle-theme"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
export default function NavLayout(){
  const router = useRouter()
  return (
    <div className="h-[70px] bg-nav  flex items-center justify-between px-7 py-3">
      <Link href={"/"} className="flex items-center gap-5">
      <div className="object-cover w-[50px] h-[50px]">
      <img src="../favicon.ico" className="w-[100%] h-[100%]"/>
      </div>
      <p className="font-bold text-2xl text-nav-text">LMS</p>
      </Link>
      <div className="flex items-center gap-5">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="text-xl text-nav-text" >Login</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => router.push("/login?admin=false")}>
            Student / teacher
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/login?admin=true")}>
            Admin
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        <ToggleTheme/>
      </div>
    </div>
  )
}