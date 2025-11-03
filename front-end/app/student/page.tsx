import Image from "next/image";
import yard from "../../public/friend.jpg";
import Notice from "./notice";
export default function StudentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Image
          className="rounded-xl shadow-sm"
          src={yard}
          quality={100}
          style={{ objectFit: "cover" }}
          width={640}
          height={480}
          placeholder="blur"
          alt="Illustration of a classroom"
        />

        <div className="w-full">
          <div className="rounded-xl border bg-muted/40 p-6">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            {/* <blockquote className="text-center"> */}
            <p className="text-center text-xl italic font-medium text-foreground">
              Nhà trường chỉ cho chúng ta chiếc chìa khóa tri thức, học trong
              cuộc sống là công việc cả đời.
            </p>
            {/* </blockquote> */}
            <figcaption className="flex items-center justify-center mt-6 space-x-3">
              <img
                className="w-8 h-8 rounded-full"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/375px-Bill_Gates_2018.jpg"
                alt="Bill Gates"
              />
              <div className="flex items-center divide-x divide-gray-300 dark:divide-gray-700">
                <cite className="pe-3 font-medium">Bill Gates</cite>
                <cite className="ps-3 text-sm text-muted-foreground">
                  Chủ tịch tập đoàn Microsoft
                </cite>
              </div>
            </figcaption>
          </div>
        </div>
      </div>

      <Notice />
    </div>
  );
}
