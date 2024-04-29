import { BookText } from "lucide-react";
type quizInfo = {
  title: string;
  url: string;
  description: string;
  key: number;
};
export default function DocCard(data: quizInfo) {
  return (
    <div
      onClick={() => window.open(`${data?.url}`)}
      key={data?.key}
      className="dark:border-nav border-2 border-black rounded-sm p-3 flex gap-3 items-center"
    >
      <div className="bg-nav w-[40px] h-[40px] dark:bg-black flex justify-center items-center rounded-sm">
        <BookText className="dark:text-main" />
      </div>
      <div className="dark:text-main">
        <p className="font-bold">{data?.title}</p>
        <p className="text-[12px]">{data?.description}</p>
      </div>
    </div>
  );
}
