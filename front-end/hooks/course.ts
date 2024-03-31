import Course from "@/lib/axios/course";
import Cookies from "universal-cookie";
import { useQuery } from "@tanstack/react-query";
export default function CourseQuery(id: string) {
  const cookies = new Cookies();
  const token = cookies.get("token") ?? null;
  const fecthCourse = async () => {
    const user = await Course.GetDetailCourse(token, id);
    return user;
  };

  const user: any = useQuery({
    queryKey: ["courseData"],
    queryFn: fecthCourse,
  });
  return user;
}
