import Semester from "@/lib/axios/semester";
import { useQuery, useMutation } from "@tanstack/react-query";
export default function SemesterQuery() {
  const fecthSemester = async () => {
    const user = await Semester?.GetAllSemester();
    return user;
  };

  const user: any = useQuery({
    queryKey: ["semesterData"],
    queryFn: fecthSemester,
  });
  return user;
}
export function SemesterResultQuery() {
  const fecthCourse = async (data: any) => {
    const user = await Semester.GetCourseResultBySemester(data);
    return user;
  };

  const course = useMutation({
    mutationKey: ["semesterResultData"],
    mutationFn: (data: any) => fecthCourse(data),
  });
  return course;
}
