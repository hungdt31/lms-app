"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MdAddBox } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { RiErrorWarningFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Course from "@/lib/axios/course";
import Link from "next/link";

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  course_id: z.string().min(1, {
    message: "Course ID is required",
  }),
  file: z
    .string()
    .url({
      message: "Image must be a valid URL",
    })
    .optional()
    .or(z.literal("")),
});

export default function AddCoursePage() {
  const [loading, setLoading] = useState<any>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      course_id: "",
      file: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    await Course.AddCourse(data).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Course added successfully",
        });
        router.push("/admin/courses");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    });
  }

  return (
    <div className="py-5">
      <div className="flex gap-7 m-auto flex-col mt-[40px]">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex gap-3 items-center font-bold underline ">
            <MdAddBox size={24} />
            <p>ADD COURSE</p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course Title</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input className="col-span-7" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course ID</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input className="col-span-4" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">
                      <div className="grid grid-cols-12 items-center">
                        <div className="col-span-11">Course Description</div>
                        <div className="col-span-1">
                          <RiErrorWarningFill className="text-red-500" />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="col-span-8" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <FormLabel className="col-span-4">Image</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-8 items-center p-0 pt-1.5"
                        type="file"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="italic" />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end gap-4">
              <Link href="/admin/courses">
                <Button variant="outline">Cancel</Button>
              </Link>
              {!loading && <Button type="submit">Save</Button>}
              {loading && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
