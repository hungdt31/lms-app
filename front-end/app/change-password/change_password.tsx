import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import formSchema from "@/lib/zod/ChangeValidate";
import LoginLooading from "@/components/loading/login";
import { useToast } from "@/components/ui/use-toast";
import User from "@/lib/axios/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
export default function ChangePassword() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<any>(false);
  const alert = (mess: string, variant: any) =>
    toast({
      variant,
      title: "Uh oh! Something went wrong.",
      description: mess,
      action:
        variant == "default" ? (
          <Link href={"/"}>
            <ToastAction altText="Try again">Go home</ToastAction>
          </Link>
        ) : (
          <ToastAction altText="Try again">Try again</ToastAction>
        ),
      onClick: () => form.setFocus("email"),
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      old_password: "",
      new_password: "",
    },
  });
  const fetchData = async (data: any) => {
    const rs = await User.ChangePassword(data);
    return rs;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result: any = await fetchData(values);
    setLoading(false);
    if (result?.success) {
      alert(result?.mess, "default");
      form.trigger(["email", "username", "old_password", "new_password"]);
      form.reset();
    } else alert(result?.mess, "destructive");
  }

  return (
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-5">
                Username
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-5">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter old password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-5">
                New password
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter new password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loading ? (
          <LoginLooading />
        ) : (
          <Button variant="outline" type="submit">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
