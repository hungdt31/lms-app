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
import formSchema from "@/lib/zod/UploadDocumentSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import z from "zod";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/text-editor";
import { useState } from "react";
import { LoginLoading } from "@/components/loading";
import Docs from "@/lib/axios/document";

export default function EditDocSection(data: any) {
  const { qr, id } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      courseId: id,
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;
  const onSubmit = async (data: any) => {
    setLoading(true);
    const rs: any = await Docs.UpdateDocumentSection(data);
    Swal.fire({
      title: "Info about deleting video section",
      text: rs.mess,
      icon: rs.success ? "success" : "error",
    });
    qr.refetch();
    setLoading(false);
    // console.log(data);
  };
  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"secondary"} className="py-5">
                <Wrench />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit document section</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit document</SheetTitle>
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
              <Input id="title" className="col-span-3" {...register("title")} />
            </div>
            <p className="text-red-500 text-[14px]">{errors?.title?.message}</p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Content</Label>
            </div>
            <TextEditor
              defaultContent={"<p>Write your content here...</p>"} // default content
              onChange={(content) => form.setValue("content", content)}
            />
            <p className="text-red-500 text-[14px]">
              {errors?.content?.message}
            </p>
          </div>
          <SheetFooter>
            {loading ? (
              <LoginLoading />
            ) : (
              <Button type="submit">Save changes</Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
