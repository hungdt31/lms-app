"use client";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Cube from "@/components/cube";
import { Button } from "@/components/ui/button";
export default function AlertDemo() {
  return (
    <div className="flex justify-center items-center h-screen w-1/2 m-auto flex-col gap-5">
      {/* <img src="./favicon.ico" width={300} height={300} /> */}
      <Cube />
      <p className="font-bold text-xl mt-4">Not found - 404!</p>
      <div className="w-1 flex justify-center">
        <Link href="/">
          <Button>
            {" "}
            <RocketIcon className="h-4 w-4 mr-3" />
            Go back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
