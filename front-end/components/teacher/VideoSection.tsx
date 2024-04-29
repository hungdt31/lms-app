"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Video from "@/lib/axios/video";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import z from "zod";
import { SquarePlay, VideoOff, Plus, Wrench, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "@/lib/zod/VideoSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import LoginLooading from "../loading/login";
import { useState, useRef } from "react";
import EditVidSection from "./EditVidSection";

export default function VideoSection(data: any) {
  const [videoLink, setVideoLink] = useState<any>(null);
  const [deleteVid, setDeleteVid] = useState<any>(false);
  const id: string = useSearchParams().get("id") as string;
  const { qr } = data;
  const checkboxRefs = useRef<HTMLInputElement[]>([]);
  const addRef = (el: any) => {
    if (el && !checkboxRefs.current.includes(el)) {
      checkboxRefs.current.push(el);
    }
  };
  const [deleteClick, setDeleteClick] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;
  const onSubmit = async (data: any) => {
    setLoading(true);
    data.courseId = id;
    const rs: any = await Video.CreateVideoSection(data);
    if (rs.success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: rs?.mess,
        showConfirmButton: false,
        timer: 1500,
      });
      qr.refetch();
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: rs?.mess,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // console.log(rs)
    setLoading(false);
  };
  const handleDeleteVideoSection = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let idArray: any = [];
        checkboxRefs.current.forEach((checkbox) => {
          if (checkbox.checked) {
            idArray.push(checkbox.value);
          }
        });
        // console.log(idArray);
        const rs: any = await Video.DeleteVideoSection(idArray);
        Swal.fire({
          title: "Info about deleting video section",
          text: rs.mess,
          icon: rs.success ? "success" : "error",
        });
        qr.refetch();
        // console.log(checkboxRefs);
      }
    });
  };
  const uploadVideo = async (id: any) => {
    setLoading(true);
    const obj = {
      video_link: videoLink,
      videoSectionId: id,
    };
    const rs: any = await Video.UploadVideo(obj);
    Swal.fire({
      title: "Info about uploading video",
      text: rs?.mess,
      icon: rs?.success ? "success" : "error",
    });
    setLoading(false);
    qr.refetch();
  };
  const HandleDeleteVideo = async () => {
    let newIdArr: any = [];
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked",
    );
    checkboxes.forEach((checkbox: any) => {
      newIdArr.push(checkbox.value);
    });
    //console.log(newIdArr);
    const rs = await Video.DeleteVideo(newIdArr);
    //console.log(rs)
    qr.refetch();
  };
  return (
    <div>
      <div className="text-main">
        <p className="h-[3px] w-[50px] bg-nav ml-auto"></p>
        <h1 className="font-bold text-2xl border-l-2 border-nav border-r-2 px-3">
          Videos
        </h1>
        <p className="h-[3px] w-[50px] bg-nav"></p>
      </div>
      <div className="p-3 flex gap-3 lg:flex-row flex-col justify-center">
        <Button
          variant={"destructive"}
          onClick={async () => {
            if (deleteClick) {
              await handleDeleteVideoSection();
            }
            setDeleteClick(!deleteClick);
          }}
        >
          {" "}
          {deleteClick ? <Trash2 /> : "Xóa mục video"}
        </Button>

        <Sheet key={"bottom"}>
          <SheetTrigger asChild>
            <Button>Thêm mục tài liệu</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>
                <SquarePlay />
              </SheetTitle>
              <SheetDescription>
                Make changes to your course here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    {...register("title")}
                  />
                  <p className="text-red-500 font-light text-[14px] ml-[50%]">
                    {errors?.title?.message}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="des" className="text-right">
                    Desciption
                  </Label>
                  <Input
                    id="des"
                    className="col-span-3"
                    {...register("description")}
                  />
                </div>
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
      </div>
      <Accordion type="multiple" className="w-full">
        {qr?.data?.data?.VideoSections?.map((el: any, index: any) => {
          return (
            <AccordionItem value={index + 1} key={index}>
              <AccordionTrigger>
                <div className="text-lg font-bold">{el?.title}</div>
                {deleteClick && (
                  <input value={el?.id} type="checkbox" ref={addRef} />
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-3 items-center flex-wrap mb-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="py-5">
                        <Plus />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-3 flex flex-col gap-5">
                      <Label htmlFor="video_link">Link</Label>
                      <Input
                        id="video_link"
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {loading ? (
                        <LoginLooading />
                      ) : (
                        <Button onClick={() => uploadVideo(el?.id)}>
                          Submit
                        </Button>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <EditVidSection qr={qr} id={el?.id} />
                  <Button
                    className="py-5"
                    variant={"destructive"}
                    onClick={() => {
                      setTrigger(index);
                      setDeleteVid(!deleteVid);
                      if (deleteVid) HandleDeleteVideo();
                    }}
                  >
                    {deleteVid ? "Delete" : <VideoOff />}
                  </Button>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: el?.description }}
                  className="p-3"
                />
                {el?.videos?.map((e: any) => {
                  return (
                    <a className="card card-side shadow-xl" href={e?.url}>
                      <figure>
                        <img src={e?.thumbnail} alt="video" />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{e?.title}</h2>
                        <p>{e?.description}</p>
                        <div className="card-actions justify-end">
                          <Button variant="link">{e?.provider}</Button>
                          {trigger == index && deleteVid && (
                            <input
                              type="checkbox"
                              className="checkbox checkbox-error"
                              value={e?.id}
                            />
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
