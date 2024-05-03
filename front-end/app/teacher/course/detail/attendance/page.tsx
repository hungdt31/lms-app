"use client";
import { DataTable as DataTable2 } from "./data-table";
import { columns as columns2 } from "./column";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import { CourseQuery } from "@/hooks/course";
import Cookies from "universal-cookie";
import Post from "@/lib/axios/post";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CircleFadingPlus, Check, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ListUserQuery } from "@/hooks/user";
import DataTable from "@/components/teacher/DataTable";
import { columns } from "@/helpers/Column";
import TimeConvert from "@/helpers/TimeConvert";
import { useToast } from "@/components/ui/use-toast";
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});
export default function Attendance() {
  const [trigger, setTrigger] = useState<any>(null);
  const mutation = ListUserQuery();
  const { toast } = useToast();
  const [forum, setForum] = useState<any>(null);
  const token = new Cookies().get("token");
  const [deleteFr, setDeleteFr] = useState<Boolean>(false);
  const id: string = useSearchParams().get("id") as string;
  const { data } = CourseQuery(id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Forum title",
    },
  });
  const fetchForum = async () => {
    const res = await Post.GetForumByCourse(id);
    console.log(res?.data);
    setForum(res?.data);
  };
  useEffect(() => {
    mutation.mutate({ token, id: data?.data?.id });
    fetchForum();
  }, [data]);
  const addForum = async (data: any) => {
    data.courseId = id;
    const rs: any = await Post.CreateForum(data);
    if (rs?.success) {
      fetchForum();
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
    // console.log(data)
  };
  const deleteForum = async () => {
    let newIdArr: any = [];
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked",
    );
    checkboxes.forEach((checkbox: any) => {
      newIdArr.push(checkbox.value);
    });
    console.log(newIdArr);
    const rs: any = await Post.DeleteForum(newIdArr, token);
    if (rs?.success) {
      fetchForum();
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
  const addThread = async (data: any, id: any) => {
    data.forumId = id;
    const rs: any = await Post.CreateThread(data);
    if (rs?.success) {
      fetchForum();
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
    // console.log(data)
  };
  console.log(mutation)
  return (
    <div>
      {mutation?.data?.data && (
        <DataTable columns={columns} data={mutation?.data?.data} />
      )}
      <div>
        <h1 className="text-xl font-bold mt-7">Diễn đàn</h1>
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-3"
              >
                <CircleFadingPlus /> Thêm mục diễn đàn
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(addForum)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3 my-5">
                          <Label>Title </Label>
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
          {deleteFr ? (
            <Button
              variant={"destructive"}
              onClick={() => {
                deleteForum();
                setDeleteFr(false);
              }}
              className="rounded-full flex items-center gap-3"
            >
              <Check />
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => {
                setDeleteFr(true);
              }}
              className="rounded-full flex items-center gap-3"
            >
              <X />
              Xóa mục diễn đàn
            </Button>
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {forum?.map((el: any, index: number) => {
            return (
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  {el?.title}{" "}
                  {deleteFr && <input type="checkbox" value={el?.id} />}
                </AccordionTrigger>

                <AccordionContent>
                  <div className="relative">
                    <div className="absolute right-3 bottom-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button>
                            <Plus />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit((data: any) =>
                                addThread(data, el?.id),
                              )}
                              className="space-y-8"
                            >
                              <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex items-center gap-3 my-5">
                                      <Label>Title </Label>
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
                    </div>
                    <DataTable2
                      columns={columns2}
                      data={el?.threads}
                      fetch={fetchForum}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
