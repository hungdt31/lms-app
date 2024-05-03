"use client";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  SquarePlus,
  Plus,
  SquarePen,
  X,
  FileUp,
  MessageCircleQuestion,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { Button as Btn } from "../ui/button";
import { Input } from "@/components/ui/input";
import { use, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DocumentSection from "@/lib/axios/document";
import UploadDocument from "./AddDocs";
import EditDocSection from "./EditDocSection";
import { useRouter } from "next/navigation";
export default function DocSection(data: any) {
  const { qr } = data;
  const router = useRouter();
  const checkboxRefs = useRef<HTMLInputElement[]>([]);
  // const checkboxDocLinkRefs = useRef<HTMLInputElement[]>([]);
  const [trigger, setTrigger] = useState<any>(null);
  const [clickAdd, setClickAdd] = useState<boolean>(false);
  const [clickDelete, setClickDelete] = useState<boolean>(false);
  const [option, setOption] = useState<String>("");
  const id: string = useSearchParams().get("id") as string;
  const setIcon = () => {
    if (option === "add") {
      return (
        <Link href={`/teacher/course/detail/upload?id=${id}`}>
          <div className="tooltip" data-tip={option}>
            <SquarePlus />
          </div>
        </Link>
      );
    } else if (option === "delete") {
      return <Button onClick={() => HandleDeleteSubmit()}>Delete</Button>;
    } else return "";
  };
  const HandleDeleteSubmit = async () => {
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
        let newIdArr: any = [];
        checkboxRefs.current.forEach((checkbox) => {
          if (checkbox.checked) {
            newIdArr.push(checkbox.value);
          }
        });
        // console.log(newIdArr);
        const rs: any = await DocumentSection.DeleteDocumentSection(newIdArr);
        Swal.fire({
          title: "Info about deleting document section",
          text: rs.mess,
          icon: rs.success ? "success" : "error",
        });
        qr.refetch();
      }
    });
  };
  const HandleDeleteSubmit2 = async () => {
    let newIdArr: any = [];
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked",
    );
    checkboxes.forEach((checkbox: any) => {
      newIdArr.push(checkbox.value);
    });
    console.log(newIdArr);
    await DocumentSection.DeleteQuizAndDocumentLink(newIdArr);
    qr.refetch();
  };
  const addRef = (el: any) => {
    if (el && !checkboxRefs.current.includes(el)) {
      checkboxRefs.current.push(el);
    }
  };
  return (
    <div>
      <div className="text-main">
        <p className="h-[3px] w-[50px] bg-nav ml-auto"></p>
        <h1 className="font-bold text-2xl border-l-2 border-nav border-r-2 px-3">
          Tài liệu và bài kiểm tra
        </h1>
        <p className="h-[3px] w-[50px] bg-nav"></p>
      </div>
      <div className="flex gap-3 items-center"></div>
      <div className="flex items-center gap-3 mt-5">
        <Select onValueChange={(e) => setOption(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" defaultChecked>
              None
            </SelectItem>
            <SelectItem value="add">Thêm mục tài liệu</SelectItem>
            <SelectItem value="delete">Xóa mục tài liệu</SelectItem>
          </SelectContent>
        </Select>
        {setIcon()}
      </div>
      <Accordion type="multiple" className="w-full">
        {qr?.data?.data?.DocumentSections?.map((el: any, index: any) => {
          return (
            <AccordionItem value={index + 1} key={index}>
              <AccordionTrigger>
                <div className="text-lg font-bold">{el?.title}</div>
                {option == "delete" && (
                  <div className="ml-5">
                    <Input value={el?.id} type="checkbox" ref={addRef} />
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-3 mb-3 items-center">
                  <Btn
                    variant={"destructive"}
                    className="py-5"
                    // className="btn btn-outline btn-error"
                    onClick={() => {
                      setClickDelete(!clickDelete);
                      setTrigger(index);
                      if (clickDelete) {
                        HandleDeleteSubmit2();
                      }
                    }}
                  >
                    {clickDelete && trigger == index ? "Delete" : <X />}
                  </Btn>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Btn variant="outline" className="py-5">
                        <Plus />
                      </Btn>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setClickAdd(true);
                          setTrigger(index);
                        }}
                      >
                        Tạo thẻ tài liệu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(
                            `/teacher/course/detail/upload/submission?id=${id}&did=${el?.id}`,
                          );
                        }}
                      >
                        Tạo phần submission
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setClickAdd(false);
                          setTrigger(index);
                        }}
                      >
                        Đóng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link
                    href={`/teacher/course/detail/upload/quiz?id=${id}&did=${el?.id}`}
                  >
                    <Btn
                      // className="btn btn-outline btn-info"
                      className="py-5"
                    >
                      <MessageCircleQuestion />
                    </Btn>
                  </Link>

                  <EditDocSection qr={qr} id={el?.id} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: el?.content }} />

                {el?.documentLink?.map((doc: any, _index: any) => {
                  return (
                    <Link
                      target="_blank"
                      href={doc?.url}
                      className={
                        trigger == index && clickDelete
                          ? `flex items-center gap-3`
                          : ""
                      }
                    >
                      <div
                        className="flex items-center mt-3 gap-3 border-2 border-section p-3 rounded-md shadow-lg dark:border-cyan-500"
                        key={_index}
                      >
                        <FileText className="text-cyan-500" />
                        <div className="text-cyan-500">
                          <p className="text-base font-bold">{doc?.title}</p>
                          <p className="text-xs">{doc?.description}</p>
                        </div>
                      </div>
                      {clickDelete && trigger == index && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          value={doc?.id}
                        />
                      )}
                    </Link>
                  );
                })}
                {el?.quiz?.map((quiz: any, _index: any) => {
                  return (
                    <div
                      className={
                        trigger == index && clickDelete
                          ? `flex items-center gap-3`
                          : ""
                      }
                    >
                      <Link
                        href={`/teacher/course/detail/quiz?id=${id}&qid=${quiz?.id}`}
                        className="flex items-center mt-3 gap-3 border-2 border-section p-3 rounded-md shadow-lg dark:border-red-500"
                        key={_index}
                      >
                        <SquarePen className="text-red-500" />
                        <div className="text-red-500">
                          <div className="text-base font-bold">
                            {quiz?.title}
                          </div>
                          <div className="text-xs">{quiz?.description}</div>
                        </div>
                      </Link>
                      {clickDelete && trigger == index && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          value={quiz?.id}
                        />
                      )}
                    </div>
                  );
                })}
                {el?.submissions?.map((submission: any, _index: any) => {
                  return (
                    <Link
                      target="_blank"
                      href={`/teacher/course/detail/submission?sid=${submission?.id}&id=${id}`}
                      className={
                        trigger == index && clickDelete
                          ? `flex items-center gap-3`
                          : ""
                      }
                    >
                      <div
                        className="flex items-center mt-3 gap-3 border-2 border-section p-3 rounded-md shadow-lg dark:border-rose-900"
                        key={_index}
                      >
                        <FileUp className="text-rose-900" />
                        <div className="text-rose-900">
                          <div className="text-base font-bold">
                            {submission?.title}
                          </div>
                        </div>
                      </div>
                      {clickDelete && trigger == index && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          value={submission?.id}
                        />
                      )}
                    </Link>
                  );
                })}
                {clickAdd && trigger == index && (
                  <UploadDocument id={el?.id} qr={qr} />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
