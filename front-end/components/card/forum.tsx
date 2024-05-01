import { Strikethrough } from "lucide-react";
import Link from "next/link";
type ForumInfo = {
  title: string;
  id: string;
};
export default function ForumCard(data: ForumInfo) {
  return (
    <Link
      href={`/student/course/forum?id=${data?.id}`}
      key={data?.id}
      className="dark:border-yellow-600 border-2 border-black rounded-sm p-3 flex gap-3 items-center"
    >
      <div className="bg-yellow-600 w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
        <Strikethrough className="dark:text-yellow-600" />
      </div>
      <div className="dark:text-yellow-600">
        <p className="font-bold">{data?.title}</p>
      </div>
    </Link>
  );
}
