'use client'
import { useSearchParams } from "next/navigation"
import { CourseQuery } from "@/hooks/course";
import { ChangeEvent, useState } from 'react';
export default function SubmissionPage(){
  function FileUploadMultiple() {
    const [fileList, setFileList] = useState<FileList | null>(null);
  
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFileList(e.target.files);
    };
  
    const handleUploadClick = () => {
      if (!fileList) {
        return;
      }
      console.log(fileList)
    };
  
    // 👇 files is not an array, but it's iterable, spread to get an array of files
    const files = fileList ? [...fileList] : [];
  
    return (
      <div>
        <input type="file" onChange={handleFileChange} multiple />
        <br/>
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              <div className = "grid w-[60px] h-[50px] border border-gray-600 shadow-xl rounded-lg"></div>
              {file.name}
            </li>
          ))}
        </ul>
  
        <button className="btn btn-info" onClick={handleUploadClick}>Upload</button>
      </div>
    );
  }
  return (
    <div className = "w-[70%] container rounded-lg border border-gray-600 shadow-xl">
    <br/>
    <div className = "text-2xl">CHỌN FILE NỘP BÀI TẠI ĐÂY<br/>TÊN SUBMISSION</div>
    <div className = "w-[90%] container rounded-lg border border-gray-600 shadow-xl">
      Đề SUBMISSION
    </div>
    <br/>
    <FileUploadMultiple/>
    <br/>
    <br/>
    </div>
  )
}
