"use client";
import { useSearchParams } from "next/navigation";
import User from "@/lib/axios/user";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import columns from "./column";
import { DataTable } from "./data-table";
import _columns from "./_column";
import _DataTable from "./_data-table";
export default function MemberPage() {
  const cookies = new Cookies();
  const token: any = cookies.get("token");
  const [users, setUsers] = useState<any>(null);
  const [addition, setAddition] = useState<any>(false);
  const [users_not, setUsers_not] = useState<any>(null);
  const id: any = useSearchParams().get("id");
  const obj = {
    id,
    token,
  };
  const fetchUsers = async () => {
    const rs: any = await User.GetUserByCourseId(id, token);
    //console.log(rs?.data);
    setUsers(rs?.data);
  };
  const fetchUsersNotInCourse = async () => {
    const rs: any = await User.GetUserNotInCourse(id, token);
    //console.log(rs?.data);
    setUsers_not(rs?.data);
  };
  useEffect(() => {
    fetchUsers();
    fetchUsersNotInCourse();
  }, []);
  return (
    <div>
      {!addition && users && (
        <DataTable
          columns={columns}
          data={users?.users}
          courseInfo={users?.course}
          fetchData={fetchUsers}
          other={obj}
          addition={addition}
          setAddition={setAddition}
        />
      )}
      <div className="flex justify-center">
        {users_not && addition && (
          <_DataTable
            other={obj}
            addition={addition}
            setAddition={setAddition}
            columns={_columns}
            data={users_not}
            fetchData={fetchUsers}
            fetchData_not={fetchUsersNotInCourse}
          />
        )}
      </div>
    </div>
  );
}
