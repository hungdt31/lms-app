"use client";
import { z } from "zod";
import JoditEditor from "jodit-pro-react";
import LoginLooading from "@/components/loading/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import formSchema from "@/lib/zod/UploadDocumentSection";
import { Button } from "@radix-ui/themes";
import { Button as Btn } from "@/components/ui/button";
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
} from "@radix-ui/react-icons";
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
import { CourseQuery } from "@/hooks/course";
import Docs from "@/lib/axios/document";
export default function Attendance() {
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    uploader: {
      url: "https://xdsoft.net/jodit/finder/?action=fileUpload",
    },
    filebrowser: {
      ajax: {
        url: "https://xdsoft.net/jodit/finder/",
      },
      height: 580,
    },
    style: {
      background: "white",
      color: "black",
    },
  };
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const id = useSearchParams().get("id");
  const { data } = CourseQuery(id);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    setLoading(true);
    values.courseId = id;
    console.log(values);
    const rs = await Docs.CreateNewDocs(values);
    console.log(rs);
    setLoading(false);
    if (rs.success) {
    Swal.fire({
      title: "<strong>Created new document successfully</strong>",
      icon: "info",
      html: `
        You can use <b>bold text</b>,
        <a href="#">links</a>,
        and other HTML tags
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> Go to create new document and quiz 
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
    }).then((result) => {
      if (result.isDismissed) {
        router.push(
          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail?id=${id}`
        );
      }
      else if (result.isConfirmed){
        router.push(
          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/update?id=${rs?.data?.id}`
        )
      }
    })
  } else {
    Swal.fire({
      title: "<strong>Created new document failed</strong>",
      icon: "error",
      html: `
        You can use <b>bold text</b>,
        <a href="#">links</a>,
        and other HTML tags
      `,
      showCancelButton: true,
      focusConfirm: false,
      cancelButtonText: `
        <i class="fa fa-thumbs-down"></i>
      `,
      cancelButtonAriaLabel: "Upload failed"
    });
  }
  }
  return (
    <div className="flex justify-center pt-8">
      <Card className="">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title of new document"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {
                  setContent(newContent);
                  form.setValue("content", newContent);
                }} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
              {loading ? (
                <LoginLooading />
              ) : (
                <div className="flex justify-between">
                  <Link href={`${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail?id=${id}`}>
                    <Btn variant={"link"}>
                      <ArrowLeftIcon />
                      <p className="text-[14px] ml-[2px]">Return</p>
                    </Btn>
                  </Link>
                  <div className="flex gap-3">
                    <Button type="submit" variant="surface">
                      Submit
                    </Button>
                    <Button
                      variant="surface"
                      onClick={() => {
                        form.trigger(["title","content"]);
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
