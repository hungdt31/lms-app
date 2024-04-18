import instance from "@/axios";
async function GetQuiz(id: any) {
  return await instance({
    method: "get",
    url: `/quiz?id=${id}`,
  });
}
async function MarkQuiz(data : any) {
  return await instance({
    method: "post",
    url: `/quiz/result`,
    data
  });
}
async function GetResult(id : string) {
  return await instance({
    method: "get",
    url: `/quiz/result?id=${id}`
  })
}
async function CreateQuiz(data : any) {
  return await instance({
    method: "post",
    url: `/quiz`,
    data
  });
}
const Quiz = { GetQuiz, MarkQuiz, GetResult, CreateQuiz };
export default Quiz;
