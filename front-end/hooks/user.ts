import User from "@/lib/axios/user";
import Cookies from "universal-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
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
export function ListUserQuery() {
  const cookies = new Cookies();
  const token = cookies.get("token") ?? null;
  const fetchListUser = async (data: any) => {
    const user = await User.GetListUser(token, data.id);
    return user;
  };

  const listUser: any = useMutation({
    mutationKey: ["listUserData"],
    mutationFn: (data) => fetchListUser(data),
  });
  return listUser;
}
export function UserQueryByTeacher() {
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
