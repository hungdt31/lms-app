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
const Grade = { GetCourseResult, UpdateCourseResult };
export default Grade;