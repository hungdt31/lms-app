import User from "@/lib/axios/user";
import Cookies from "universal-cookie";
import { useQuery } from "@tanstack/react-query";
export default function UserQuery() {
  const cookies = new Cookies();
  const token = cookies.get("token") ?? null;
  const fecthUser = async () => {
    const user = await User.GetCurrentUser(token);
    return user;
  };

  const user: any = useQuery({
    queryKey: ["userData"],
    queryFn: fecthUser,
  });
  return user;
}