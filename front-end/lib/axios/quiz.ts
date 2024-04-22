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
async function GetAllQuizResultByUser(data: any) {
  return await instance({
    method: "get",
    url: `/quiz/all-result?uid=${data?.uid}&cid=${data?.cid}`,
  })
}
async function GetQuizPlay(id: any) {
  return await instance({
    method: "get",
    url: `/quiz/play?id=${id}`,
  });
}
async function StartQuiz(id: any, uid: any) {
  const data = {
    id,
    uid
  }
  return await instance({
    method: "post",
    url: `/quiz/start`,
    data
  });
}
const Quiz = { GetQuiz, MarkQuiz, GetResult, CreateQuiz, GetAllQuizResultByUser, GetQuizPlay, StartQuiz };
export default Quiz;