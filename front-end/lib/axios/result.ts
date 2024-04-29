import instance from "@/axios";
type Info = {
  cid: string;
  uid: string;
}
async function GetCourseResult(data : Info) {
  return await instance({
    method: "get",
    url: `/grade/course/result?cid=${data.cid}&uid=${data.uid}`,
  });
}
async function UpdateCourseResult(data : any) {
  return await instance({
    method: "put",
    url: `/grade/course`,
    data
  });
}
async function GetQuizResultAndSubmit(data : any) {
  return await instance({
    method: "get",
    url: `/grade/quiz-submit?id=${data.id}`,
    headers: {
      Authorization: `Bearer ${data.token}`,
    }
  });
}
const Grade = { GetCourseResult, UpdateCourseResult, GetQuizResultAndSubmit };
export default Grade;