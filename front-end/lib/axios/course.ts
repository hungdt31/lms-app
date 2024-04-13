import instance from "@/axios";

async function GetAllCourse() {
  return await instance({
    method: "get",
    url: "/course",
  });
}
async function GetAllSubscribedCourse(token: any) {
  return await instance({
    method: "get",
    url: "/course/my",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}
async function GetDetailCourse(token: string, id: string) {
  return await instance({
    method: "get",
    url: `/course/detail?id=${id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}
async function GetCourseByFilter(data : any) {
  return await instance({
    method: "post",
    url: "/course/filter",
    data
  });
}
const Course = { GetAllCourse, GetAllSubscribedCourse, GetDetailCourse, GetCourseByFilter };
export default Course;
