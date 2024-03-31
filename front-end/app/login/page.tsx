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
        alert("You are not authorized to enter this site", "default");
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
        alert("Your account does not have enough permissions", "default");
      }
    } else if (auth?.role == "STUDENT") {
      if (isAdmin == "false") {
        await setCookie(token);
        alert("Login successfully", "default");
        router.push("/student");
        router.refresh();
      } else {
        alert("Your account does not have enough permissions", "default");
        setLoading(false);
      }
    } else {
      alert(user?.mess, "destructive");
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-center pt-8">
      <Card className="sm:w-[60%] w-[80%] lg:w-1/3">
        <CardHeader>
          <CardTitle>Login {isAdmin == "true" ? "as admin" : ""}</CardTitle>
          <CardDescription>Come to us today ☀️</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-5">
                      Password{" "}
                      <p
                        onClick={() => setShowPass((state: Boolean) => !state)}
                      >
                        {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type={showPass ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link href={"/change-password"}>
                <Btn variant={"link"}>Change Password</Btn>
              </Link>
              {loading ? (
                <LoginLooading />
              ) : (
                <div className="flex justify-between">
                  <Link href={"/"}>
                    <Btn variant={"link"}>
                      <ArrowLeftIcon />
                      <p className="text-[14px] ml-[2px]">Home</p>
                    </Btn>
                  </Link>
                  <div className="flex gap-3">
                    <Button type="submit" variant="surface">
                      Submit
                    </Button>
                    <Button
                      variant="surface"
                      onClick={() => {
                        form.trigger(["email", "password"]);
                        form.reset();
                      }}
                    >
                      Clear
                    </Button>
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
