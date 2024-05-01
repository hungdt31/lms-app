import instance from "@/axios";

async function GetAllCourse(id : any) {
  return await instance({
    method: "get",
    url: `/course?id=${id}`,
  });
}
async function GetAllSubscribedCourse(data: any) {
  return await instance({
    method: "get",
    url: `/course/my?name=${data?.name}&cate_id=${data?.cate_id}&semester_id=${data?.semester_id}&name_sort=${data?.name_sort}&page=${data?.page}`,
    headers: {
      Authorization: "Bearer " + data?.token,
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
async function GetBredcrumbByQuizId(id: any) {
  return await instance({
    method: "get",
    url: `/course/quiz?id=${id}`,
  });
}
async function GetBredcrumbBySubmissonId(id: any) {
  return await instance({
    method: "get",
    url: `/course/submission?id=${id}`,
  });
}
async function AddStudentToCourse(data: any) {
  return await instance({
    method: "put",
    url: "/course/add-student",
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
    data: data?.courseIds,
  });
}
async function AddCourse(data: any) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("course_id", data.course_id);
  formData.append("file", data.file);
  formData.append("semesterId", data.semesterId);
  formData.append("categoryId", data.categoryId);
  formData.append("time", data.time);
  formData.append("date", data.date);
  formData.append("credit", data.credit);
  formData.append("quantity", data.quantity);
  if (data?.teacherId) formData.append("teacherId", data.teacherId)
  if (data?.schedule) {
    for (let i = 0; i < data?.schedule.length; i++) {
      formData.append("schedule", data?.schedule[i]);
    }
  }
  return await instance({
    method: "post",
    url: "/course",
    data: formData,
  });
}
async function GetScoreFactor(id: any) {
  return await instance({
    method: "get",
    url: `/course/score-factor?id=${id}`,
  });
}
async function GetDetailCourseByAdmin(data : any){
  return await instance({
    method: "get",
    url: `/course/admin?id=${data?.id}`,
    headers: {
      Authorization: "Bearer " + data?.token,
    },
  });
}
async function UpdateCourseByAdmin (data : any, id : any, token : any){
  const form = new FormData();
  form.append("title", data.title);
  form.append("description", data.description);
  form.append("course_id", data.course_id);
  if(data?.file) form.append("file", data.file);
  form.append("date", data.date);
  form.append("time", data.time);
  form.append("categoryId", data.categoryId);
  form.append("credit", data.credit);
  form.append("quantity", data.quantity);
  if (data?.schedule) {
    for (let i = 0; i < data?.schedule.length; i++) {
      form.append("schedule", data?.schedule[i]);
    }
  }
  return await instance({
    method: "put",
    url: `/course/admin?id=${id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
    data : form
  });
}
async function DeleteCourseByAdmin (id : any, token : any){
  return await instance({
    method: "delete",
    url: `/course?id=${id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}
const Course = {
  GetAllCourse,
  GetAllSubscribedCourse,
  GetDetailCourse,
  GetCourseByFilter,
  AddCourse,
  AddStudentToCourse,
  GetBredcrumbByQuizId,
  GetBredcrumbBySubmissonId,
  GetScoreFactor,
  GetDetailCourseByAdmin,
  UpdateCourseByAdmin,
  DeleteCourseByAdmin
};
export default Course;
