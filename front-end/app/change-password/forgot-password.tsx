import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ForgotSchema from "@/lib/zod/ForgotPassword";
import Swal from "sweetalert2";
import { ThickArrowLeftIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import LoginLooading from "@/components/loading/login";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import User from "@/lib/axios/user";
import { useState } from "react";
import { z } from "zod";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "@radix-ui/themes";
import ConfirmSchema from "@/lib/zod/ConfirmValidate";
import { useRouter } from "next/navigation";
import {
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
export default function ForgotPassword() {
  const router = useRouter();
  const [idUser, setIdUser] = useState<any>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [page, setPage] = useState([true, false, false]);
  const [showPass, setShowPass] = useState<Boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<Boolean>(false);
  const alert = (mess: string, variant: any) =>
    toast({
      variant,
      title: "Uh oh! Something happen",
      description: mess,
      action:
        variant == "default" ? (
          <ToastAction altText="Try again">Completelly</ToastAction>
        ) : (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      onClick: () => form1.setFocus("email"),
    });
  const form1 = useForm<z.infer<typeof ForgotSchema>>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });
  // Handle send mail for user
  async function onSubmit1(values: z.infer<typeof ForgotSchema>) {
    setLoading(true);
    // console.log(values);
    const mail: any = await User.SendMail(values);
    if (!mail?.success) alert(mail?.mess, "destructive");
    else {
      alert(mail?.mess, "default");
      setPage([false, true, false]);
    }
    setLoading(false);
  }
  // handle code recieved from email
  const verify = async () => {
    if (otp.length < 6) {
      alert("Please enter exactly 6 character !", "destructive");
      return;
    }
    setLoading(true);
    const user: any = await User.VerifyCodeFromEmail(otp);
    if (!user?.success) {
      setPage([true, false, false]);
      alert(user?.mess, "destructive");
    } else {
      alert(user?.mess, "default");
      setPage([false, false, true]);
      setIdUser(user?.data);
    }
    setLoading(false);
  };
  const form2 = useForm<z.infer<typeof ConfirmSchema>>({
    resolver: zodResolver(ConfirmSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  async function onSubmit2(values: z.infer<typeof ConfirmSchema>) {
    // console.log(values);
    setLoading(true);
    const data = {
      id: idUser,
      password: values?.password,
    };
    const rs: any = await User.UpdatePassword(data);
    if (!rs?.success) {
      alert(rs?.mess, "destructive");
    } else {
      Swal.fire({
        title: "Auto close alert!",
        html: rs?.mess,
        timer: 2000,
        timerProgressBar: true,
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          router.push("/");
        }
      });
    }
    setLoading(false);
  }

  return (
    <div className="pt-5">
      {page?.map((el: any, index: any) => {
        if (index == 0 && el) {
          return (
            <Form {...form1} key={index}>
              <form
                onSubmit={form1.handleSubmit(onSubmit1)}
                className="space-y-8"
              >
                <FormField
                  control={form1.control}
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
                  control={form1.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading ? (
                  <LoginLooading />
                ) : (
                  <Button variant="outline" type="submit">
                    Send email
                  </Button>
                )}
              </form>
            </Form>
          );
        } else if (index == 1 && el) {
          return (
            <div key={index}>
              <p className="mb-5 font-medium">Enter code sent to your email</p>
              <div className="flex justify-center mb-7">
                <InputOTP maxLength={6} onChange={(e: any) => setOtp(e)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPage([true, false, false])}
                >
                  <ThickArrowLeftIcon />
                  Prev
                </Button>
                <Button variant="outline" onClick={() => verify()}>
                  Next
                  <ThickArrowRightIcon />
                </Button>
              </div>
            </div>
          );
        } else if (index == 2 && el) {
          return (
            <Form {...form2} key={index}>
              <form
                onSubmit={form2.handleSubmit(onSubmit2)}
                className="space-y-8"
              >
                <FormField
                  control={form2.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            {...field}
                            type={showPass ? "text" : "password"}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass((state: Boolean) => !state)}
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
                <FormField
                  control={form2.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm your password"
                            {...field}
                            type={showConfirmPass ? "text" : "password"}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass((state: Boolean) => !state)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                          >
                            {showConfirmPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading ? (
                  <LoginLooading />
                ) : (
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPage([true, false, false]);
                        setIdUser(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="outline" type="submit">
                      Submit
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          );
        }
      })}
    </div>
  );
}
