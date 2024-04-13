import Course from "@/lib/axios/course";
import Cookies from "universal-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
export function CourseQuery(id: string) {
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
export function CourseFilterQuery() {
  const fecthCourse = async (data: any) => {
    const user = await Course.GetCourseByFilter(data);
    return user;
  };

  const course = useMutation({
    mutationKey: ["courseFilterData"],
    mutationFn: (data : any) => fecthCourse(data),
  });
  return course;
}
