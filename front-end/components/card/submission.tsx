import { FileUp } from "lucide-react";
import Link from "next/link";
import TimeConvert from "@/helpers/TimeConvert";
type submissionInfo = {
  title: string;
  id: string;
  createdAt: string;
  key: number;
};
export default function SubmissionCard(data: submissionInfo) {
  return (
    <Link
      href={`/student/course/submission?id=${data?.id}`}
      key={data?.key}
      className="dark:border-orange-500 border-2 border-black rounded-sm p-3 flex gap-3 items-center"
    >
      <div className="bg-orange-500 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
        <FileUp className="dark:text-orange-500" />
      </div>
      <div className="dark:text-orange-500">
        <p className="font-bold">{data?.title}</p>
        <p className="text-[12px]">{TimeConvert(data?.createdAt)}</p>
      </div>
    </Link>
  );
}
