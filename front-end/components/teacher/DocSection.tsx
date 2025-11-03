"use client";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  SquarePen,
  X,
  FileUp,
  MessageCircleQuestion,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button as Btn } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import DocumentSection from "@/lib/axios/document";
import UploadDocument from "./AddDocs";
import EditDocSection from "./EditDocSection";
import { useRouter } from "next/navigation";

// Local short datetime formatter: dd/MM/yyyy HH:mm
const formatShortDate = (iso?: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${d}/${m}/${y} ${hh}:${mm}`;
};
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
  // Toggle delete mode for DocumentSections
  const toggleDeleteMode = async () => {
    if (option === "delete") {
      await HandleDeleteSubmit();
      setOption("");
    } else {
      setOption("delete");
    }
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
      <div className="mb-4">
        <h2 className="font-bold text-3xl tracking-tight text-foreground">
          Tài liệu và bài kiểm tra
        </h2>
        <div className="h-1 w-20 bg-primary rounded mt-1" />
      </div>
      <div className="flex gap-3 items-center"></div>
      <div className="p-3 flex gap-3 lg:flex-row flex-col items-center">
        <Btn variant="destructive" onClick={toggleDeleteMode}>
          {option === "delete" ? "Delete" : "Xóa mục tài liệu"}
        </Btn>
        <Link href={`/teacher/course/detail/upload?id=${id}`}>
          <Btn>Thêm mục tài liệu</Btn>
        </Link>
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

                  <EditDocSection qr={qr} id={el?.id} title={el?.title} content={el?.content} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: el?.content }} />

                {el?.documentLink?.map((doc: any, _index: any) => {
                  return (
                    <Link
                      key={_index}
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
                        <div>
                          <p className="text-base font-bold text-cyan-500">{doc?.title}</p>
                          <p className="text-xs text-muted-foreground">{doc?.description}</p>
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
                      key={_index}
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
                        <div>
                          <div className="text-base font-bold text-red-500">
                            {quiz?.title}
                          </div>
                          <div className="text-xs text-muted-foreground">{quiz?.description}</div>
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
                      key={_index}
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
                          <div className="text-xs text-muted-foreground mt-1">
                            Opened: {formatShortDate(submission?.start_date)}
                            <span className="mx-2">•</span>
                            Due: {formatShortDate(submission?.end_date)}
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
                  <UploadDocument id={el?.id} qr={qr} onClose={() => setClickAdd(false)} />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
