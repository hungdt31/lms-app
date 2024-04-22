import instance from "@/axios";
async function GetSubmission(id : any) {
  return await instance({
    method: "get",
    url: `/submission?id=${id}`,
  })
}
async function CreateSubmission(data: any) {
  const form = new FormData();
  form.append("title", data?.title);
  form.append("description", data?.description);
  form.append("start_date", new Date(data?.start_date).toISOString());
  form.append("end_date", new Date(data?.end_date).toISOString());
  if (data?.files) {
    for (const file of data.files) {
      form.append("files", file);
    }
  }
  form.append("documentSectionId", data?.documentSectionId);
  return await instance({
    method: "post",
    url: "/submission",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: form
  });
}
async function GetAllSubmissionResult(data : any) {
  return await instance({
    method: "get",
    url: `/submission/all-result?courseId=${data?.submissionId}&userId=${data?.userId}`,
  });
}
async function GetSubmissionResult(data : any) {
  return await instance({
    method: "get",
    url: `/submission/result?submissionId=${data?.submissionId}&userId=${data?.userId}`,
  });
}
async function UpdateSubmissionResult(data : any) {
  return await instance({
    method: "put",
    url: `/submission/result`,
    data
  });
}

const Submission = { GetSubmission, CreateSubmission, GetAllSubmissionResult, GetSubmissionResult, UpdateSubmissionResult}
export default Submission;