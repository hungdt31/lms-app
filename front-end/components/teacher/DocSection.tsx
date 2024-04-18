"use client";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  SquarePlus,
  Plus,
  SquarePen,
  X,
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
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DocumentSection from "@/lib/axios/document";
import UploadDocument from "./AddDocs";
import EditDocSection from "./EditDocSection";

export default function DocSection(data: any) {
  const { qr } = data;
  // const [title, setTitle] = useState<String>("");
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
        <Link
          href={`${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail/upload?id=${id}`}
        >
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
      <div className="flex gap-3 items-center">
        <p className="text-xl font-bold">Danh sách tài liệu tham khảo</p>
      </div>
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
                  <button
                    className="btn btn-outline btn-error"
                    onClick={() => {
                      setClickDelete(!clickDelete);
                      setTrigger(index);
                      if (clickDelete) {
                        HandleDeleteSubmit2();
                      }
                    }}
                  >
                    {clickDelete && trigger == index ? "Delete" : <X />}
                  </button>
                  <button
                    className="btn btn-outline btn-info"
                    onClick={() => {
                      setClickAdd(!clickAdd);
                      setTrigger(index);
                    }}
                  >
                    <Plus />
                  </button>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_FRONT_END}/teacher/course/detail/upload/quiz?id=${id}&did=${el?.id}`}
                  >
                    <button
                      className="btn btn-outline btn-info"
                      onClick={() => {}}
                    >
                      <MessageCircleQuestion />
                    </button>
                  </Link>

                  <EditDocSection qr={qr} id={el?.id} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: el?.content }} />

                {el?.documentLink?.map((doc: any, _index: any) => {
                  return (
                    <div
                      className={
                        trigger == index && clickDelete
                          ? `flex items-center gap-3`
                          : "max-w-[400px]"
                      }
                    >
                      <div
                        className="flex items-center mt-3 gap-3 border-2 border-section p-3 rounded-md shadow-lg dark:border-cyan-500"
                        key={_index}
                      >
                        <FileText className="text-cyan-500" />
                        <Link href={doc?.url} className="text-cyan-500">
                          <p className="text-base font-bold">{doc?.title}</p>
                          <p className="text-xs">{doc?.description}</p>
                        </Link>
                      </div>
                      {clickDelete && trigger == index && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          value={doc?.id}
                        />
                      )}
                    </div>
                  );
                })}
                {el?.quiz?.map((quiz: any, _index: any) => {
                  return (
                    <div
                      className={
                        trigger == index && clickDelete
                          ? `flex items-center gap-3`
                          : "max-w-[400px]"
                      }
                    >
                      <div
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
                      </div>
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
