"use client";
import ToggleTheme from "@/components/toggle-theme";
import { useDispatch, useSelector } from "react-redux";
import { fetch_all_user } from "@/features/admin/AdminSlice";
import { useEffect } from "react";
import { PiStudentFill } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TableBodyComponent = ({ child }: any) => {
  return (
    <TableRow key={child.id}>
      <TableCell>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>
            {child?.firstname[0]}
            {child?.lastname[0]}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{child?.firstname}</TableCell>
      <TableCell>{child?.lastname}</TableCell>
      <TableCell>{child?.email}</TableCell>
    </TableRow>
  );
};

const TableHeaderComponent = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Avatar</TableHead>
        <TableHead className="w-[100px]">First Name</TableHead>
        <TableHead>Last Name</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default function AdminPage() {
  const users = useSelector((state: any) => state.user);
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(fetch_all_user());
  }, []);

  console.log(users);

  return (
    <div className="py-5">
      <ToggleTheme />

      <div className="flex gap-7 w-1/2 m-auto flex-col mt-[40px]">
        <div>
          <div className="flex gap-3 items-center font-bold underline">
            <GrUserAdmin size={24} />
            <p>ADMIN</p>
          </div>
          <Table>
            <TableHeaderComponent />
            <TableBody>
              {users?.data?.admin.map((el: any) => (
                <TableBodyComponent key={el.id} child={el} />
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="flex gap-3 items-center font-bold underline">
            <LiaChalkboardTeacherSolid size={24} />
            <p>TEACHER</p>
          </div>
          <Table>
            <TableHeaderComponent />
            <TableBody>
              {users?.data?.teacher.map((el: any) => (
                <TableBodyComponent key={el.id} child={el} />
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="flex gap-3 items-center font-bold underline">
            <PiStudentFill size={24} />
            <p>STUDENT</p>
          </div>
          <Table>
            <TableHeaderComponent />
            <TableBody>
              {users?.data?.student.map((el: any) => (
                <TableBodyComponent key={el.id} child={el} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
