import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import QueryProvider from "@/lib/react_query/query_provider";
import DetailCourse from "./course_layout";
export const metadata: Metadata = {
  title: "LMS Teacher",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider>
    <DetailCourse children={children}/>
  </QueryProvider>;
}