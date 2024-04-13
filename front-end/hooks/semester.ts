import Semester from "@/lib/axios/semester";
import { useQuery } from "@tanstack/react-query";
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
