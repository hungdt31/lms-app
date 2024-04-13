"use client";
import { useSearchParams } from "next/navigation";
import DocLinks from "@/lib/axios/documentLink";
import { FileText, SquarePlus, Plus, SquarePen, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseQuery } from "@/hooks/course";
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
import UpdateDocumentPage from "../update/AddDocs";
export default function Docs() {
  const checkboxRefs = useRef<HTMLInputElement[]>([]);
  const checkboxDocLinkRefs = useRef<HTMLInputElement[]>([]);
  const [trigger, setTrigger] = useState<any>(null);
  const [clickAdd, setClickAdd] = useState<boolean>(false);
  const [clickDelete, setClickDelete] = useState<boolean>(false);
  const [option, setOption] = useState<String>("");
  const id: string = useSearchParams().get("id") as string;
  const qr = CourseQuery(id);
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
    await DocLinks.DeleteDocumentLink(newIdArr);
    qr.refetch();
  };
  const addRef = (el: any) => {
    if (el && !checkboxRefs.current.includes(el)) {
      checkboxRefs.current.push(el);
    }
  };
  return (
    <div className="flex gap-3 sm:flex-row flex-col">
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
                  <div className="text-[16px] font-bold">{el?.title}</div>
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
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: el?.content }} />

                  {el?.documentLink?.map((doc: any, _index: any) => {
                    return (
                      <div
                        className={
                          trigger == index && clickDelete
                            ? `flex items-center gap-3`
                            : ""
                        }
                      >
                        <div
                          className="flex items-center mt-3 gap-3 border-2 border-nav p-3 rounded-md"
                          key={_index}
                        >
                          <FileText color="red" />
                          <Link href={doc?.url} className="text-main">
                            {doc?.title}
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
                        className="flex items-center mt-3 gap-3 border-2 border-nav p-3 rounded-md"
                        key={_index}
                      >
                        <SquarePen color="red" />
                        <div className="text-main">{quiz?.title}</div>
                      </div>
                    );
                  })}
                  {clickAdd && trigger == index && (
                    <UpdateDocumentPage id={el?.id} qr={qr} />
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div>
        <p className="text-xl font-bold">Videos</p>
      </div>
    </div>
  );
}
