"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "universal-cookie";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiOutlineFileJpg } from "react-icons/ai";
import { BsFiletypePng } from "react-icons/bs";
import { BsFiletypeSvg } from "react-icons/bs";
import LoginLooading from "@/components/loading/login";
import { useSearchParams } from "next/navigation";
import TimeConvert from "@/helpers/TimeConvert";
import { X, PencilLine, SquarePlus, Info } from "lucide-react";
import { FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeDocx } from "react-icons/bs";
import { GrDocument } from "react-icons/gr";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Swal from "sweetalert2";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import UserSubmissionQuery from "@/hooks/submission";
import Submission from "@/lib/axios/submission";
import { set } from "date-fns";
import BreadcrumbNav from "./breadcrumb";
export default function SubmissionPage() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [loading, setLoading] = useState<Boolean>(false);
  const [edit, setEdit] = useState<Boolean>(false);
  const [fileList, setFileList] = useState<any>(null);
  const [deleteList, setDeleteList] = useState<any>([]);
  const [addList, setAddList] = useState<any>([]);
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const [info, setInfo] = useState<any>(null);
  const [addClick, setAddClick] = useState<Boolean>(false);
  const id: string = useSearchParams().get("id") as string;
  const userResult = UserSubmissionQuery(id);
  console.log(userResult);
  useEffect(() => {
    setFileList(userResult?.data?.data?.files);
    console.log(userResult?.data?.data?.files);
  }, [userResult?.isSuccess, userResult?.data]);
  const GetIcon = (str: string) => {
    if (str.includes(".pdf")) return <FaRegFilePdf size={20} />;
    else if (str.includes(".docx")) return <BsFiletypeDocx size={20} />;
    else if (str.includes(".jpg")) return <AiOutlineFileJpg size={20} />;
    else if (str.includes(".png")) return <BsFiletypePng size={20} />;
    else if (str.includes(".svg")) return <BsFiletypeSvg size={20} />;
    else return <GrDocument size={20} />;
  };
  const fetchInfo = async () => {
    const info = await Submission.GetSubmission(id);
    console.log(info?.data);
    setInfo(info?.data);
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const handleAddFile = (e: any) => {
    const arr = [];
    for (let i = 0; i < e?.target?.files?.length; i++) {
      arr.push(e?.target?.files[i]);
    }
    setAddList(arr);
  };
  const handleUpdate = () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      setLoading(true);
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const rs: any = await Submission.UpdateUserSubmission({
          deleteList,
          addList,
          id: userResult?.data?.data?.id,
        });
        if (rs?.success) {
          userResult.refetch();
          if (ref?.current) ref.current.value = null;
          setAddList([]);
          setDeleteList([]);
        }
        Swal.fire({
          title: rs?.success ? "Saved!" : "Error!",
          text: rs?.mess,
          icon: rs?.success ? "success" : "error",
        });
        setLoading(false);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        setLoading(false);
      }
    });
    // console.log({
    //   deleteList,
    //   addList,
    //   id
    // })
  };
  const handleCreate = async () => {
    setLoading(true);
    const rs: any = await Submission.CreateUserSubmission(
      {
        addList,
        id,
      },
      token,
    );
    Swal.fire({
      title: rs?.success ? "Saved!" : "Error!",
      text: rs?.mess,
      icon: rs?.success ? "success" : "error",
    });
    // console.log({
    //   addList,
    //   id,
    // });
    if (rs?.success) {
      if (ref2?.current) ref2.current.value = null;
      setAddList([]);
      setDeleteList([]);
      userResult.refetch();
    }
    setLoading(false);
  };
  return (
    <div className="">
      <BreadcrumbNav />
      <div className="flex justify-center">
        <div>
          <div className="dark:text-orange-500 flex items-center gap-3 my-5 ml-3 lg:ml-0">
            <div className="w-[50px] h-[50px] flex justify-center items-center bg-orange-500 dark:bg-black text-white dark:text-orange-500 rounded-lg">
              <FileUp size={30} />
            </div>
            <div className="">
              <p className="h-[3px] w-[50px] bg-orange-500 ml-auto"></p>
              <h1 className="font-bold text-2xl border-l-2 border-orange-500 border-r-2 px-3">
                {info?.title}
              </h1>
              <p className="h-[3px] w-[50px] bg-orange-500"></p>
            </div>
          </div>
          <Card className="w-full">
            <CardHeader>
              <div className="flex gap-3 items-center">
                <CardTitle>Opened:</CardTitle>
                <CardDescription>
                  {TimeConvert(info?.start_date)}
                </CardDescription>
              </div>
              <div className="flex gap-3 items-center">
                <CardTitle>Due:</CardTitle>
                <CardDescription>{TimeConvert(info?.end_date)}</CardDescription>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="mt-5">
              <div
                dangerouslySetInnerHTML={{ __html: info?.description }}
              ></div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-3">
                {info?.files?.map((el: any) => {
                  return (
                    <div className="flex gap-3 items-center flex-wrap">
                      {GetIcon(el?.title)}
                      <a
                        href={el?.url}
                        target="_blank"
                        className="text-cyan-500 hover:underline"
                      >
                        {el.title}
                      </a>
                      <p className="ml-3 text-xs text-gray-500">
                        {TimeConvert(el?.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="flex justify-center py-5">
        {userResult?.data?.data ? (
          <Card className="lg:w-[60%] w-[90%]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between w-[100%]">
                <p className="text-orange-500 text-xl">Nộp bài __</p>
                <div className="flex gap-3 items-center">
                  <Popover>
                    <PopoverTrigger>
                      <Info />
                    </PopoverTrigger>
                    <PopoverContent>
                      <p>
                        Tạo lúc:{" "}
                        <a className="font-[14px] font-mono">
                          {TimeConvert(userResult?.data?.data?.createdAt)}
                        </a>
                      </p>
                      <p>
                        Chỉnh sửa:{" "}
                        <a className="font-[14px] font-mono">
                          {TimeConvert(userResult?.data?.data?.updatedAt)}
                        </a>
                      </p>
                    </PopoverContent>
                  </Popover>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PencilLine
                          className="cursor-pointer"
                          onClick={() => setEdit(!edit)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update submission</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Điểm: {userResult?.data?.data?.score || "Chưa chấm"}</p>
              <CardDescription>
                Đã chấm lúc:{" "}
                {userResult?.data?.data?.beGraded
                  ? TimeConvert(userResult?.data?.data?.beGraded)
                  : "..."}
              </CardDescription>
              <CardDescription>
                Sửa điểm lần cuối:{" "}
                {userResult?.data?.data?.editGradeAt
                  ? TimeConvert(userResult?.data?.data?.editGradeAt)
                  : "..."}
              </CardDescription>
              <p className="my-5">Các tập tin đã nộp</p>
              {fileList?.map((el: any, index: number) => {
                return (
                  <div className="flex gap-3 items-center flex-wrap">
                    {GetIcon(el?.title)}
                    <a
                      href={el?.url}
                      target="_blank"
                      className="text-cyan-500 hover:underline"
                    >
                      {el.title}
                    </a>
                    <p className="ml-3 text-xs text-gray-500">
                      {TimeConvert(el?.createdAt)}
                    </p>
                    {edit && (
                      <Button
                        onClick={() => {
                          setFileList(
                            fileList.filter(function (e: any) {
                              return e?.id !== el?.id;
                            }),
                          );
                          setDeleteList([...deleteList, el]);
                        }}
                        variant={"link"}
                      >
                        <X size={20} className="text-red-500 cursor-pointer" />
                      </Button>
                    )}
                  </div>
                );
              })}
              {edit && (
                <div>
                  <div className="flex items-center gap-3 mt-3">
                    <SquarePlus onClick={() => setAddClick(!addClick)} />

                    {addClick && (
                      <div className="flex gap-3 items-center">
                        <Input
                          type="file"
                          multiple
                          onChange={handleAddFile}
                          ref={ref}
                        />
                        <Button
                          variant={"secondary"}
                          onClick={() => {
                            if (ref?.current) ref.current.value = null;
                            setAddList([]);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                  {addList?.map((el: any, index: number) => {
                    return (
                      <div className="mt-3 flex gap-3 items-center">
                        <p>{el?.name}</p>{" "}
                        <X
                          size={20}
                          className="text-red-500 cursor-pointer"
                          onClick={() => {
                            let dt = new DataTransfer();
                            let files = ref.current.files;
                            for (let i = 0; i < files.length; i++) {
                              if (files[i].name !== el?.name) {
                                dt.items.add(files[i]);
                              }
                            }
                            ref.current.files = dt.files;
                            let arr = [];
                            for (let i = 0; i < ref.current.files.length; i++) {
                              arr.push(ref.current.files[i]);
                            }
                            setAddList(arr);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              {edit && (
                <Button onClick={handleUpdate}>
                  {loading ? <LoginLooading /> : "Update"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <p className="text-rose-900 text-xl">Nộp bài __</p>
            </CardHeader>
            <CardContent>
              <Label htmlFor="file">Upload file</Label>
              <Input
                type="file"
                multiple
                onChange={handleAddFile}
                ref={ref2}
                id="file"
              />
              {addList?.map((el: any, index: number) => {
                return (
                  <div className="mt-3 flex gap-3 items-center">
                    <p>{el?.name}</p>{" "}
                    <X
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        let dt = new DataTransfer();
                        let files = ref2.current.files;
                        for (let i = 0; i < files.length; i++) {
                          if (files[i].name !== el?.name) {
                            dt.items.add(files[i]);
                          }
                        }
                        ref2.current.files = dt.files;
                        let arr = [];
                        for (let i = 0; i < ref2.current.files.length; i++) {
                          arr.push(ref2.current.files[i]);
                        }
                        setAddList(arr);
                      }}
                    />
                  </div>
                );
              })}
            </CardContent>
            <CardFooter>
              {loading ? (
                <LoginLooading />
              ) : (
                <Button onClick={handleCreate} variant={"secondary"}>
                  Submit
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
