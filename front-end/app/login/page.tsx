"use client";
import { z } from "zod";
import LoginLooading from "@/components/loading/login";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import formSchema from "@/lib/zod/LoginValidate";
import { Button } from "@radix-ui/themes";
import { Button as Btn } from "@/components/ui/button";
import User from "@/lib/axios/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { verifyJwtToken } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function ProfileForm() {
  // ...
  const [showPass, setShowPass] = useState<Boolean>(false);
  const isAdmin = useSearchParams().get("admin");
  const [loading, setLoading] = useState<any>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const alert = (mess: string, variant: any) =>
    toast({
      variant,
      title: "Uh oh! Something happens.",
      description: mess,
      action:
        variant == "default" ? (
          <ToastAction altText="successfully">Successfully</ToastAction>
        ) : (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      onClick: () => form.setFocus("email"),
    });
  const setCookie = async (token: string) => {
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(token),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .then((responseJson) => {
        // Do something with the response
        // console.log(responseJson)
      })
      .catch((error) => {
        console.clear();
      });
  };

  const { toast } = useToast();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    const user: any = await User.Login(values);
    // console.log(user)
    setLoading(false);
    const token = user?.access_token;
    // console.log(token);

    const auth = await verifyJwtToken(token);

    if (auth?.role == "ADMIN") {
      if (isAdmin == "true") {
        await setCookie(token);
        alert("Login successfully", "default");
        router.push("/admin");
        router.refresh();
      } else {
        alert("You are not authorized to enter this site", "destructive");
        setLoading(false);
      }
    } else if (auth?.role == "TEACHER") {
      if (isAdmin == "false") {
        await setCookie(token);
        alert("Login successfully", "default");
        router.push("/teacher");
        router.refresh();
      } else {
        setLoading(false);
        alert("Your account does not have enough permissions", "destructive");
      }
    } else if (auth?.role == "STUDENT") {
      if (isAdmin == "false") {
        await setCookie(token);
        alert("Login successfully", "default");
        router.push("/student");
        router.refresh();
      } else {
        alert("Your account does not have enough permissions", "destructive");
        setLoading(false);
      }
    } else {
      alert(user?.mess, "destructive");
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <Link href="/">
            <Btn
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon />
              Home
            </Btn>
          </Link>
          <div className="flex justify-center mb-6">
            {/* You can add your logo here */}
            <GraduationCap size={50} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            {isAdmin == "true"
              ? "Login to admin dashboard"
              : "Login to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={loading}
                          className="pl-10 h-11"
                          placeholder="Enter your email"
                          {...field}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              const m: any = document.getElementById("myBtn");
                              m.click();
                            }
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg
                            className="w-5 h-5 opacity-70"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={loading}
                          className="pl-10 h-11"
                          placeholder="Enter your password"
                          {...field}
                          type={showPass ? "text" : "password"}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              const m: any = document.getElementById("myBtn");
                              m.click();
                            }
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg
                            className="w-5 h-5 opacity-70"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowPass((state: Boolean) => !state)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                        >
                          {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link
                  href="/change-password"
                  className="text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {loading ? (
                <div className="py-2 flex justify-center">
                  <LoginLooading label="Đang đăng nhập..." size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Btn
                      type="button"
                      variant={"secondary"}
                      className="min-w-[100px]"
                      onClick={() => {
                        form.trigger(["email", "password"]);
                        form.reset();
                      }}
                    >
                      Clear
                    </Btn>
                    <Btn type="submit" id="myBtn" className="min-w-[100px]">
                      Sign in
                    </Btn>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
