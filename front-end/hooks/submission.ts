import Submission from "@/lib/axios/submission";
import { useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
export default function UserSubmissionQuery(id : any) {
  const token = new Cookies().get("token");
  const fecthSubmission = async () => {
    const rs = await Submission.GetUserSubmission(id, token);
    return rs;
  };

  const result: any = useQuery({
    queryKey: ["semesterData"],
    queryFn: fecthSubmission,
  });
  return result;
}
