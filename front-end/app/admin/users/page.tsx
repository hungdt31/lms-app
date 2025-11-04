"use client";
import * as React from "react";
import User from "@/lib/axios/user";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useEffect } from "react";
import { PiStudentFill } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import LoginLooading from "@/components/loading/login";
import DataTable from "@/components/admin/DataTable";
import { admin_columns, student_columns } from "@/helpers/Column";
import { AllUserQuery } from "@/hooks/user";

const formSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }).min(2, "Too Short!"),
  role: z.string().min(2),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  password: z
    .string()
    .min(2, "Too Short!")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine(
      (password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password),
      { message: "Password must contain at least one special character" },
    )
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one number",
    }),
});

const TableBodyComponent = ({ child }: any) => {
  return (
    <TableRow key={child.id}>
      <TableCell>
        <Avatar>
          <AvatarImage src={child?.avatar} alt="@shadcn" />
          <AvatarFallback>
            {child?.firstname[0]}
            {child?.lastname[0]}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{child?.firstname}</TableCell>
      <TableCell>{child?.lastname}</TableCell>
      <TableCell>{child?.email}</TableCell>
    </TableRow>
  );
};

const TableHeaderComponent = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Avatar</TableHead>
        <TableHead className="w-[100px]">First Name</TableHead>
        <TableHead>Last Name</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<any>([]);
  const fetchData = AllUserQuery();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      role: "STUDENT",
    },
  });
  // console.log(users)
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
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //console.log(values);
    setLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const arr = [];
    arr.push(values);
    const rs: any = await User.AddUser(arr);
    if (rs.success) {
      fetchData.refetch();
    }
    setLoading(false);
    Swal.fire({
      title: rs?.success ? "Saved!" : "Error!",
      text: rs?.success
        ? "Your changes have been saved."
        : "Something went wrong!",
      icon: rs?.success ? "success" : "error",
      confirmButtonText: "OK",
      timer: 1000,
    });
  }

  useEffect(() => {
    setUsers(fetchData?.data?.data);
  }, [fetchData?.data]);

  //console.log(users);

  return (
    <div className="p-7">
      <div className="flex items-center gap-3">
        <Drawer>
          <DrawerTrigger>
            <Button className="py-5">
              <Plus className="mr-3" />
              Add User
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-5 grid sm:grid-cols-2 grid-cols-1"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="max-w-[500px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem {...field}>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="STUDENT">Student</SelectItem>
                              <SelectItem value="TEACHER">Teacher</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                          className="max-w-[500px]"
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
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
                          placeholder="Enter your last name"
                          {...field}
                          className="max-w-[500px]"
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          className="max-w-[500px]"
                        />
                      </FormControl>
                      <FormDescription>This field is required.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading ? (
                  <LoginLooading />
                ) : (
                  <div>
                    <Button type="submit">Submit</Button>
                    <DrawerClose>
                      <Button variant="outline" className="ml-5">
                        Cancel
                      </Button>
                    </DrawerClose>
                  </div>
                )}
              </form>
            </Form>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex gap-7 m-auto flex-col mt-[40px]">
        <div>
          <Button variant="link">
            <GrUserAdmin size={24} className="mr-3" />
            <p>ADMIN</p>
          </Button>
          <Table>
            <TableHeaderComponent />
            <TableBody>
              {users?.admin?.map((el: any) => (
                <TableBodyComponent key={el.id} child={el} />
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <Button variant="link">
            <LiaChalkboardTeacherSolid size={24} className="mr-3" />
            <p>TEACHER</p>
          </Button>
          {users?.teacher && (
            <DataTable
              data={users?.teacher}
              columns={admin_columns}
              query={fetchData}
            />
          )}
        </div>
        <div>
          <Button variant="link">
            <PiStudentFill size={24} className="mr-3" />
            <p>STUDENT</p>
          </Button>
          {users?.student && (
            <DataTable
              data={users?.student}
              columns={student_columns}
              query={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
