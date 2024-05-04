"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserQuery from "@/hooks/user";
import { useEffect, useState } from "react";
import { FilePenLine, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import JoditReact from "jodit-react-ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CircleFadingPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeConvert from "@/helpers/TimeConvert";
import Post from "@/lib/axios/post";
import { Label } from "@/components/ui/label";
import Cookies from "universal-cookie";
import { toast } from "@/components/ui/use-toast";
import admin_page from "./admin_page.jpg";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  sender: z.string().optional(),
  receiver: z.string().min(1, { message: "Receiver is required" }),
});
const formSchema2 = z.object({
  name: z.string().min(1, { message: "Title is required" }),
});
export default function AdminPage() {
  const [editId, setEditId] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [addtion, setAddtion] = useState<any>(null);
  const [deletion, setDeletion] = useState<any>(null);
  const [deleteNoti, setDeleteNoti] = useState<Boolean>(false);
  const [trigger, setTrigger] = useState<any>(null);
  const [triggerId, setTriggerId] = useState<any>(null);
  const [nofitication, setNofitication] = useState<any>(null);
  const [totalPost, setTotalPost] = useState<any>(null);
  const fetchData = async () => {
    const data: any = await Post.GetAllNofitication();
    console.log(data);
    setNofitication(data?.data);
    setTotalPost(data?.totalPost);
  };
  const token = new Cookies().get("token");
  const userData = UserQuery();
  const [value, setValue] = useState<string>();
  const config = {
    style: {
      color: "black",
    },
  };
  useEffect(() => {
    if (userData) {
      setUser(userData?.data?.data);
    }
    fetchData();
  }, [userData?.data]);
  // 1. Define your form.
  const defaultValues = {
    title: "Thông báo",
    content: "Nội dung",
    sender: "",
    receiver: "ALL",
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const form2 = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      name: "Thông báo",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    values.notificationId = triggerId;
    const rs: any = await Post.CreatePost(values, token);
    if (rs?.success) {
      fetchData();
      toast({
        variant: "default",
        title: "Success!",
        description: rs?.mess,
      });
    } else
      toast({
        variant: "destructive",
        title: "Error!",
        description: rs?.mess,
      });
    setAddtion(false);
    setTrigger(null);
    setTriggerId(null);
    // console.log(data);
    console.log(values);
  }
  const deletePost = async (id: any) => {
    let newIdArr: any = [];
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked",
    );
    checkboxes.forEach((checkbox: any) => {
      newIdArr.push(checkbox.value);
    });
    console.log(newIdArr);
    const rs: any = await Post.deletePost(
      { pid: newIdArr, nid: triggerId },
      token,
    );
    if (rs?.success) {
      fetchData();
      toast({
        variant: "default",
        title: "Success!",
        description: rs?.mess,
      });
    } else
      toast({
        variant: "destructive",
        title: "Error!",
        description: rs?.mess,
      });
    setTrigger(null);
    setDeletion(false);
    setTriggerId(null);
  };
  const updatePost = async (values: any) => {
    const rs: any = await Post.updatePost(values, editId, token);
    if (rs?.success) {
      fetchData();
      toast({
        variant: "default",
        title: "Success!",
        description: rs?.mess,
      });
      form.reset(defaultValues);
    } else
      toast({
        variant: "destructive",
        title: "Error!",
        description: rs?.mess,
      });
    setEditId(null);
    console.log(values);
  };
  const addNotification = async (values: any) => {
    // console.log(values);
    const rs: any = await Post.createNotification(values, token);
    if (rs?.success) {
      fetchData();
      toast({
        variant: "default",
        title: "Success!",
        description: rs?.mess,
      });
    } else
      toast({
        variant: "destructive",
        title: "Error!",
        description: rs?.mess,
      });
  };
  const deleteNotification = async () => {
    let newIdArr: any = [];
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked",
    );
    checkboxes.forEach((checkbox: any) => {
      newIdArr.push(checkbox.value);
    });
    // console.log(newIdArr);
    const rs: any = await Post.deleteNotification(newIdArr, token);
    if (rs?.success) {
      fetchData();
      toast({
        variant: "default",
        title: "Success!",
        description: rs?.mess,
      });
    } else
      toast({
        variant: "destructive",
        title: "Error!",
        description: rs?.mess,
      });
  };
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      <div className="p-7">
        <div>
          <h1 className="text-3xl font-bold text-main dark:text-white text-center font-mono relative">
            Notification
            <div className="badge badge-primary badge-outline absolute top-0">
              Posts {totalPost}
            </div>
          </h1>

          <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full flex items-center gap-3"
                >
                  <CircleFadingPlus /> Thêm mục thông báo
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Form {...form2}>
                  <form
                    onSubmit={form2.handleSubmit(addNotification)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form2.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3 my-5">
                            <Label>Name: </Label>
                            <FormControl>
                              <Input
                                type="text"
                                className="w-[250px]"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            This is your public title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="mt-5 rounded-full"
                      variant={"secondary"}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            {deleteNoti ? (
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteNotification();
                  setDeleteNoti(false);
                }}
                className="rounded-full flex items-center gap-3"
              >
                <Check />
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={() => {
                  setDeleteNoti(true);
                }}
                className="rounded-full flex items-center gap-3"
              >
                <X />
                Xóa mục thông báo
              </Button>
            )}
          </div>
        </div>
        <div></div>
        <Accordion type="single" collapsible className="w-full">
          {nofitication?.map((item: any, index: any) => {
            return (
              <AccordionItem key={index} value={`index-${index + 1}`}>
                <AccordionTrigger>
                  <p className="font-bold text-xl">
                    {item.name}{" "}
                    {deleteNoti && <input type="checkbox" value={item?.id} />}
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    <a className="font-bold">Chỉnh sửa lần cuối: </a>
                    <>{TimeConvert(item.updatedAt)}</>
                  </p>

                  {addtion ? (
                    <Button
                      className="my-3"
                      onClick={() => {
                        setAddtion(false);
                        setTriggerId(null);
                      }}
                    >
                      Hủy
                    </Button>
                  ) : (
                    <div className="flex gap-3 items-center mt-3">
                      <Button
                        onClick={() => {
                          setTrigger(index);
                          setAddtion(true);
                          setTriggerId(item.id);
                        }}
                      >
                        Thêm
                      </Button>
                      {deletion ? (
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            deletePost(item.id);
                          }}
                        >
                          <Check />
                        </Button>
                      ) : (
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            setTrigger(index);
                            setDeletion(true);
                            setTriggerId(item.id);
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  )}

                  {addtion && trigger == index ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Send Notification</CardTitle>
                        <CardDescription>
                          Submit to save changed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                          >
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-3 my-5">
                                    <Label>Title: </Label>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        className="w-[250px]"
                                        {...field}
                                      />
                                    </FormControl>
                                  </div>
                                  <FormDescription>
                                    This is your public title.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sender"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-3 my-5">
                                    <Label>From: </Label>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        className="w-[250px]"
                                        {...field}
                                      />
                                    </FormControl>
                                  </div>
                                  <FormDescription>
                                    This is your public display name.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="receiver"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-3 my-5">
                                    <Label>Receive: </Label>
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e)}
                                      >
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select a object" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="ALL">
                                              All
                                            </SelectItem>
                                            <SelectItem value="TEACHER">
                                              Teacher
                                            </SelectItem>
                                            <SelectItem value="STUDENT">
                                              Student
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <FormDescription>
                                    About the receivers.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Content: </Label>
                                  <FormControl>
                                    <div className="mt-3">
                                      <JoditReact
                                        onChange={(content) =>
                                          form.setValue("content", content)
                                        }
                                        defaultValue={form.getValues("content")}
                                        config={config}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    This is your public content.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              className="mt-5 rounded-full"
                              variant={"secondary"}
                              type="submit"
                            >
                              Submit
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                      <CardFooter></CardFooter>
                    </Card>
                  ) : (
                    <div>
                      {item?.posts?.map((post: any) =>
                        editId === post.id ? (
                          <Card className="mt-5" key={post.id}>
                            <CardHeader>
                              <CardTitle>Edit post</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Form {...form}>
                                <form
                                  onSubmit={form.handleSubmit(updatePost)}
                                  className="space-y-8"
                                >
                                  <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 my-5">
                                          <Label>Title: </Label>
                                          <FormControl>
                                            <Input
                                              type="text"
                                              className="w-[250px]"
                                              {...field}
                                            />
                                          </FormControl>
                                        </div>
                                        <FormDescription>
                                          This is your public title.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="sender"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 my-5">
                                          <Label>From: </Label>
                                          <FormControl>
                                            <Input
                                              type="text"
                                              className="w-[250px]"
                                              {...field}
                                            />
                                          </FormControl>
                                        </div>
                                        <FormDescription>
                                          This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="receiver"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 my-5">
                                          <Label>Receive: </Label>
                                          <FormControl>
                                            <Select
                                              value={field.value}
                                              onValueChange={(e) =>
                                                field.onChange(e)
                                              }
                                            >
                                              <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a object" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  <SelectItem value="ALL">
                                                    All
                                                  </SelectItem>
                                                  <SelectItem value="TEACHER">
                                                    Teacher
                                                  </SelectItem>
                                                  <SelectItem value="STUDENT">
                                                    Student
                                                  </SelectItem>
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                        </div>
                                        <FormDescription>
                                          About the receivers.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                      <FormItem>
                                        <Label>Content: </Label>
                                        <FormControl>
                                          <div className="mt-3">
                                            <JoditReact
                                              onChange={(content) =>
                                                form.setValue(
                                                  "content",
                                                  content,
                                                )
                                              }
                                              defaultValue={form.getValues(
                                                "content",
                                              )}
                                              config={config}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormDescription>
                                          This is your public content.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    className="mt-5 rounded-full mr-3"
                                    variant={"secondary"}
                                    onClick={() => {
                                      setEditId(null);
                                      form.reset(defaultValues);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="mt-5 rounded-full"
                                    type="submit"
                                  >
                                    Submit
                                  </Button>
                                </form>
                              </Form>
                            </CardContent>
                            <CardFooter></CardFooter>
                          </Card>
                        ) : (
                          <div
                            key={post.id}
                            className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg my-2 shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <h1 className="text-main dark:text-white font-bold text-lg flex items-center gap-3">
                                {post.title}{" "}
                                <Badge
                                  variant={
                                    post.receiver === "ALL"
                                      ? "default"
                                      : post.receiver === "TEACHER"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {post.receiver}
                                </Badge>
                              </h1>
                              <FilePenLine
                                onClick={() => {
                                  form.reset({
                                    title: post.title,
                                    content: post.content,
                                    sender: post.sender,
                                    receiver: post.receiver,
                                  });
                                  setEditId(post.id);
                                }}
                              />
                            </div>
                            <p className="text-gray-500">
                              Bởi <a className="text-cyan-700">{post.sender}</a>{" "}
                              - {TimeConvert(post.createdAt)}
                            </p>
                            <p className="text-gray-500">
                              Chỉnh sửa - {TimeConvert(post.updatedAt)}
                            </p>
                            <div
                              dangerouslySetInnerHTML={{ __html: post.content }}
                              className="mt-5"
                            />
                            {trigger === index && deletion && (
                              <div className="flex justify-end">
                                <input type="checkbox" value={post?.id} />
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <Image className="w-full shadow-lg" alt="admin image" src={admin_page} />
    </div>
  );
}
