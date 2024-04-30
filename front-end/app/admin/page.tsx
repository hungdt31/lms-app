"use client"
import UserQuery from "@/hooks/user";
import { useEffect, useState } from "react";
export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const userData = UserQuery();
  useEffect(() => {
    if (userData) {
      setUser(userData?.data?.data);
    }
  }, [userData?.data]);
  return <div>{user?.firstname}</div>;
}
