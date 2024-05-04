"use client";
import { Input } from "@/components/ui/input";
import JoditReact from "jodit-react-ts";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoginLooading from "@/components/loading/login";
import Swal from "sweetalert2";
import Submission from "@/lib/axios/submission";
import formSchema from "@/lib/zod/Submission";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
export default function SubmissionPage() {
  const id: string = useSearchParams().get("id") as string;
  const did: string = useSearchParams().get("did") as string;
  const router = useRouter();
  const defaultValues = {
    title: "",
    description: "",
    files: [],
    start_date: new Date(),
    end_date: new Date(),
  };
  const [loading, setLoading] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    uploader: {
      url: "https://xdsoft.net/jodit/finder/?action=fileUpload",
    },
    filebrowser: {
      ajax: {
        url: "https://xdsoft.net/jodit/finder/",
      },
    },
    style: {
      background: "white",
      color: "black",
    },
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    data.documentSectionId = did;
    const rs: any = await Submission.CreateSubmission(data);
    Swal.fire({
      icon: rs?.success ? "success" : "error",
      title: rs?.mess,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      if (rs?.success) {
        router.push(
          `${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail?id=${id}`,
        );
      }
    });
    setLoading(false);
    console.log(data);
  };
  return (
    <div>
      <h1 className="font-bold text-lg">Create new submission</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mockup-window">
          <div className="lg:w-1/2 w-[80%]">
            <Label className="m-3 font-bold" htmlFor="title">
              Tiêu đề
            </Label>
            <Input id="title" {...register("title")} className="m-3" />
            {errors?.title && (
              <p className="text-xs text-red-500 text-[14px] mt-3">
                {errors?.title?.message}
              </p>
            )}
          </div>
          <div className="m-3 flex flex-col gap-3">
            <Label className="font-bold">Ngày bắt đầu và kết thúc</Label>
            <div className="flex gap-3 justify-between items-center">
              <Input
                type="date"
                {...register("start_date", { valueAsDate: true })}
              />
              <p>to</p>
              <Input
                type="date"
                {...register("end_date", { valueAsDate: true })}
              />
            </div>
          </div>
          <div className="m-3 flex flex-col gap-3">
            <Input
              type="file"
              className="max-w-[300px]"
              multiple
              onChange={(e) => {
                const files: any = e.target.files;
                console.log(e.target.files);
                const filesArray = [];
                for (let i = 0; i < files?.length; i++) {
                  filesArray.push(files[i]);
                }
                form.setValue("files", filesArray);
              }}
            />
            <p className="ml-3 text-xs">Upload tối đa 5 files</p>
            {errors?.files && (
              <p className="text-xs text-red-500 text-[14px]">
                {errors?.files?.message}
              </p>
            )}
          </div>
          <Label className="p-3 font-bold">Mô tả</Label>
          <JoditReact
            onChange={(content) => form.setValue("description", content)}
            config={config}
            defaultValue="Hello world"
          />
          {errors?.description && (
            <p className="text-xs text-red-500 text-[14px] ml-3">
              {errors?.description?.message}
            </p>
          )}
        </div>
        {loading ? (
          <LoginLooading />
        ) : (
          <Button className="m-3" type="submit">
            Submit
          </Button>
        )}
      </form>
    </div>
  );
}
