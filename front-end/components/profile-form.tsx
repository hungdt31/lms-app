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
    // console.log(res.data);
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
    // console.log(rs);
    Swal.fire({
      title: rs?.success ? "Success" : "Error",
      text: rs?.mess,
      icon: rs?.success ? "success" : "error",
      confirmButtonText: "Ok",
    });
    setLoading(false);

    // console.log(data);
  };

  return (
    <div className="max-w-3xl mx-auto mt-[100px] p-6 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="p-4  rounded-md">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-200 focus:ring-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-gray-500">
                      This is your public display name. It can be your real name
                      or a pseudonym.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Telephone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        className="border-gray-200 focus:ring-2"
                        placeholder={
                          data?.data?.phone || "Enter your phone number"
                        }
                        defaultValue={data?.data?.phone}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-gray-500">
                      {!data?.data?.phone && <p>Your phone is empty</p>}
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Account Info Section */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="flex flex-col space-y-4">
              <FormItem>
                <FormLabel className="font-medium">
                  Email:{" "}
                  <span className="font-mono text-blue-600">
                    {data?.data?.email}
                  </span>
                </FormLabel>
                <FormDescription className="text-sm text-gray-500">
                  This field only is edited by admin
                </FormDescription>
              </FormItem>
              {data?.data?.role == "STUDENT" && (
                <FormItem>
                  <FormLabel className="font-medium">
                    Student ID:{" "}
                    <span className="font-mono text-blue-600">
                      {data?.data?.mssv}
                    </span>
                  </FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    This field only is edited by admin
                  </FormDescription>
                </FormItem>
              )}
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">First name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-200 focus:ring-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Last name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-200 focus:ring-2"
                        placeholder={data?.data?.lastname}
                        {...field}
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full border-gray-200">
                          <SelectValue
                            placeholder={data?.data?.gender || "Select gender"}
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full",
                              !field.value && "text-gray-500",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>
                                {data?.data?.date_of_birth
                                  ? format(data?.data?.date_of_birth, "PPP")
                                  : "Pick a date"}
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
                    <FormDescription className="text-sm text-gray-500">
                      Your date of birth is used to calculate your age.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {loading ? (
              <LoginLooading />
            ) : (
              <Button
                type="submit"
                className="px-6 py-2 rounded-md transition-colors"
              >
                Update Profile
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
