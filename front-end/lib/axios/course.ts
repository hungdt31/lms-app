import instance from "@/axios";

async function GetAllCourse() {
  return await instance({
    method: "get",
    url: "/course",
  });
}
async function GetAllSubscribedCourse(data: any) {
  return await instance({
    method: "get",
    url: `/course/my?cate_id=${data?.cate_id}&semester_id=${data?.semester_id}&name=${data?.name}&name_sort=${data?.name_sort}&page=${data?.page}`,
    headers: {
      Authorization: `Bearer ${data?.token}`,
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
async function GetCourseByFilter(data: any) {
  return await instance({
    method: "post",
    url: "/course/filter",
    data,
  });
}
async function GetScoreFactor(id : any) {
  return await instance({
    method: "get",
    url: `/course/score-factor?id=${id}`,
  });
}
async function GetBredcrumbByQuizId(id : any) {
  return await instance({
    method: "get",
    url: `/course/quiz?id=${id}`,
  });
}
async function GetBredcrumbBySubmissonId(id : any) {
  return await instance({
    method: "get",
    url: `/course/submission?id=${id}`,
  });
}
async function AddStudentToCourse(data: any) {
  return await instance({
    method: "put",
    url: '/course/add-student',
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
    data : data?.courseIds,
  });
}
const Course = {
  GetAllCourse,
  GetAllSubscribedCourse,
  GetDetailCourse,
  GetCourseByFilter,
  GetScoreFactor,
  GetBredcrumbByQuizId,
  GetBredcrumbBySubmissonId,
  AddStudentToCourse
};
export default Course;
