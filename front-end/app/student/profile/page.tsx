"use client";
import { useMutation } from "@tanstack/react-query";
import UserQuery from "@/hooks/user";
import User from "@/lib/axios/user";
import { RiImageEditFill } from "react-icons/ri";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Cookies from "universal-cookie";
import { useState } from "react";
import { LoginLoading } from "@/components/loading";
import ProfileForm from "@/components/profile-form";
export default function DetailCourse() {
  const cookies = new Cookies();
  const query = UserQuery();
  const { data } = query;
  const [avatar, setAvatar] = useState<string>("");
  const mutation = useMutation({
    mutationFn: (avatar: string) => {
      return User.UpdateAvatar(cookies.get("token"), avatar);
    },
    onSuccess: () => query.refetch(),
  });
  const handleSubmit = (avatar: string) => {
    mutation.mutate(avatar);
  };
  return (
    <div>
      <div className="h-24 bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 relative -mt-7">
        <div className="absolute top-9 left-[35%] flex w-[30%] flex-col justify-center items-center font-mono">
          {data?.data?.avatar ? (
            <img
              className="w-[120px] h-[120px] p-1 rounded-full ring-2 ring-white dark:ring-main"
              src={data?.data?.avatar}
              alt="Bordered avatar"
            />
          ) : (
            <div className="relative w-[100px] h-[100px] overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center">
              <p className="font-xl font-bold">
                {data?.data?.firstname[0]} {data?.data?.lastname[0]}
              </p>
            </div>
          )}
          <div className="absolute top-24 lg:left-[60%] left-[80%] sm:left-[70%]">
            <Drawer>
              <DrawerTrigger>
                <RiImageEditFill />
              </DrawerTrigger>
              <DrawerContent>
                <div className="lg:w-1/3 m-auto">
                  <div className="flex justify-center ">
                    <DrawerHeader>
                      <DrawerTitle className="text-center">
                        Update avatar
                      </DrawerTitle>
                      <DrawerDescription>
                        This action help you create new avatar
                      </DrawerDescription>
                    </DrawerHeader>
                  </div>

                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload file
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    onChange={(e: any) => setAvatar(e?.target?.files[0])}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    SVG, PNG, JPG or GIF (MAX. 800x600px).
                  </p>

                  <DrawerFooter>
                    {mutation.isPending ? (
                      <LoginLoading />
                    ) : (
                      <div className="flex justify-between">
                        <DrawerClose>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        <Button onClick={() => handleSubmit(avatar)}>
                          Submit
                        </Button>
                      </div>
                    )}
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <p className="font-bold text-xl">
            {data?.data?.firstname} {data?.data?.lastname}
          </p>
          <p className="hidden sm:block">
            Member since {data?.data?.createdAt}
          </p>
        </div>
      </div>
      <ProfileForm />
    </div>
  );
}
