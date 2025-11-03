import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Swal from "sweetalert2";
import formSchema from "@/lib/zod/VideoSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import z from "zod";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Video from "@/lib/axios/video";
import LoginLooading from "../loading/login";
import TextEditor from "@/components/text-editor";
export default function EditVidSection(data: any) {
  const { qr, id, title, description } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<String>(description || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
    },
  });
  useEffect(() => {
    if (title) form.setValue("title", title);
    if (description) form.setValue("description", description);
  }, [title, description, form]);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;
  const onSubmit = async (data: any) => {
    setLoading(true);
    const rs: any = await Video.UpdateVideoSection(data, id);
    Swal.fire({
      title: "Info about updating video section",
      text: rs.mess,
      icon: rs.success ? "success" : "error",
    });
    qr.refetch();
    setLoading(false);
  };
  // no external editor config needed for TextEditor
  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="py-5" variant={"secondary"}>
                <Wrench />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit video section</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit video info</SheetTitle>
          <SheetDescription>
            {"Make changes to your section here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" className="col-span-3" {...register("title")} defaultValue={title} />
            </div>
            <p className="text-red-500 text-[14px]">{errors?.title?.message}</p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description</Label>
            </div>
            <TextEditor
              defaultContent={description || "<p>Write your content here...</p>"}
              onChange={(val) => {
                setContent(val as any);
                form.setValue("description", val);
              }}
            />
            <p className="text-red-500 text-[14px]">
              {errors?.description?.message}
            </p>
          </div>
          <SheetFooter>
            {loading ? (
              <LoginLooading />
            ) : (
              <Button type="submit">Save changes</Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
