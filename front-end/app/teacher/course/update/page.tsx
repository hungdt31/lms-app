"use client";
import UpdateDocumentPage from "./AddDocs";
import { useSearchParams } from "next/navigation";
export default function Docs() {
  const id : string = useSearchParams().get("id") as string;
  return (
    <div>
      <UpdateDocumentPage id={id}/>
    </div>
  )
}