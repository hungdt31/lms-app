"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Cookies from "universal-cookie";
import ToggleTheme from "@/components/toggle-theme";
import Link from "next/link";
import Image from "next/image";
import icon from "./favicon.png";
import deleteToken from "@/hooks/deleteToken";
import { verifyJwtToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const cookie = new Cookies();
  const [auth, setAuth] = React.useState<any>(null);
  const checkToken = async () => {
    const rs = await verifyJwtToken(cookie.get("token"));
    setAuth(rs);
  };
  React.useEffect(() => {
    checkToken();
  }, []);
  const [type, setType] = React.useState<any>(false);
  return (
    <div className="flex justify-center items-center h-[700px]">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-center items-center h-[300px]">
            <Image
              src={icon}
              width={250}
              quality={100}
              alt="Picture of the author"
            />
          </div>
          <hr></hr>
        </CardHeader>
        <CardContent>
          {auth ? (
            <div className="flex justify-center items-center">
              <p>Logged in as {auth?.role}</p>
            </div>
          ) : (
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5 gap-3">
                  <Label htmlFor="framework">
                    Log in using your account on:
                  </Label>
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option defaultChecked value="false">
                      Student / teacher
                    </option>
                    <option value="true">Admin</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </CardContent>

        {auth ? (
          <CardFooter className="flex justify-between items-center w-full">
            <Button
              variant={"secondary"}
              onClick={async () => {
                await deleteToken();
                setAuth(null);
              }}
            >
              Log out
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `${process.env.NEXT_PUBLIC_FRONT_END}/${auth?.role.toLowerCase()}`,
                )
              }
            >
              Explore your home
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex justify-between items-center">
            <ToggleTheme />
            <Link href={{ pathname: "login", query: { admin: type } }}>
              <Button className="min-w-32">Login</Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
