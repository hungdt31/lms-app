"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import User from "@/lib/axios/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoginLooading from "@/components/loading/login";
import UserQuery from "@/hooks/user";
import Cookies from "universal-cookie";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  firstname: z.string().min(1, {
    message: "This field is required.",
  }),
  lastname: z.string().min(1, {
    message: "This field is required.",
  }),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid Number!")
    .min(10, { message: "Must be a valid mobile number" })
    .max(14, { message: "Must be a valid mobile number" }),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.

export default function ProfileForm() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [loading, setLoading] = useState<Boolean>(false);
  let form: any = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });
  const user = UserQuery();
  const { data, error, isPending } = user;
  const [defaultValues, setDefaultValues] = useState<
    Partial<ProfileFormValues>
  >({});
  const fetchUser = async () => {
    const res = await User.GetCurrentUser(token);
    console.log(res.data);
    setDefaultValues({
      username: res.data.username,
      firstname: res.data.firstname,
      lastname: res.data.lastname,
      phone: res.data.phone,
    });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    form.setValue("username", defaultValues?.username);
    form.setValue("firstname", defaultValues?.firstname);
    form.setValue("lastname", defaultValues?.lastname);
    form.setValue("phone", defaultValues?.phone);
    form.setValue("gender", defaultValues?.gender);
    form.setValue("date_of_birth", defaultValues?.date_of_birth);
  }, [defaultValues]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (data.date_of_birth) {
      data.date_of_birth = data.date_of_birth.toISOString();
    }
    const rs: any = await User.UpdateUser(token, data);
    console.log(rs);
    Swal.fire({
      title: rs?.success ? "Success" : "Error",
      text: rs?.mess,
      icon: rs?.success ? "success" : "error",
      confirmButtonText: "Ok",
    });
    setLoading(false);

    console.log(data);
  };

  return (
    <div className="mt-[150px] flex justify-center p-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>
              Email: <a className="font-mono">{data?.data?.email}</a>
            </FormLabel>
            <FormDescription>
              This field only is edited by admin
            </FormDescription>
          </FormItem>
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data?.data?.lastname}
                    {...field}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={data?.data?.phone || "none"}
                      defaultValue={data?.data?.phone}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {!data?.data?.phone && <p>Your phone is empty</p>}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={data?.data?.gender}
                          {...field}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Undefined">Undefined</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>
                            {data?.data?.date_of_birth
                              ? format(data?.data?.date_of_birth, "PPP")
                              : ""}
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? (
            <LoginLooading />
          ) : (
            <Button type="submit">Update profile</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
