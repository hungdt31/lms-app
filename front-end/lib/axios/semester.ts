import instance from "@/axios";
import { Scheherazade_New } from "next/font/google";

async function GetAllSemester() {
  return await instance({
    method: "get",
    url: "/semester",
  });
}
async function GetCourseResultBySemester(data: any) {
  return await instance({
    method: "get",
    url: `/semester/user?id=${data?.id}`,
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
  });
}
async function GetSemesterByNow() {
  return await instance({
    method: "get",
    url: "/semester/now",
  });
}
async function GetDkmhSemester(token: string) {
  return await instance({
    method: "get",
    url: "/semester/dkmh/now",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
async function GetSchedule(data: any) {
  return await instance({
    method: "get",
    url: `/semester/schedule?id=${data?.id}`,
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
  });
}
async function GetTKB(data: any) {
  return await instance({
    method: "get",
    url: `/semester/tkb?id=${data?.id}`,
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
  });
}
async function GetQuizAndSubmitTime(data: any) {
  return await instance({
    method: "get",
    url: `/semester/quiz-submit?type_filter=${data?.type}&id=${data?.id}&date_filter=${data?.date}&name_filter=${data?.name}`,
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
  });
}
async function CreateSemester(data: any) {
  return await instance({
    method: "post",
    url: "/semester",
    data,
  });
}
async function GetNumWeek(id: any) {
  return await instance({
    method: "get",
    url: `/semester/num-week?id=${id}`,
  });
}
async function DeleteDKMH(id: any) {
  return await instance({
    method: "delete",
    url: `/semester/dkmh?id=${id}`,
  });
}
async function GetDkmh(id: any) {
  return await instance({
    method: "get",
    url: `/semester/dkmh?id=${id}`,
  });
}
async function CreateNewDKMH(data: any) {
  return await instance({
    method: "post",
    url: `/semester/dkmh`,
    data,
  });
}
const Semester = {
  GetAllSemester,
  GetCourseResultBySemester,
  GetSemesterByNow,
  GetDkmhSemester,
  GetSchedule,
  GetTKB,
  GetQuizAndSubmitTime,
  CreateSemester,
  GetNumWeek,
  DeleteDKMH,
  GetDkmh,
  CreateNewDKMH,
};
export default Semester;
