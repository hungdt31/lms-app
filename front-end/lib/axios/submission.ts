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
async function CreateUserSubmission(data: any, token : any) {
  const form = new FormData();
  if (data?.addList) {
    for (const file of data.addList) {
      form.append("files", file);
    }
  }
  form.append("id", data?.id);
  return await instance({
    method: "post",
    url: "/submission/result",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    data : form
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
async function GetUserSubmission(id : any, token : any) {
  return await instance({
    method: "get",
    url: `/submission/result/token?id=${id}`,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}
async function UpdateUserSubmission(data : any) {
  const form = new FormData();
  if (data?.deleteList) {
    for (const file of data.deleteList) {
      form.append('deleteList', file.path);
    }
    for (const file of data.deleteList) {
      form.append('deleteId', file.id);
    }
  }
  if (data?.addList) {
    for (const file of data.addList) {
      form.append("files", file);
    }
  }
  form.append("id", data?.id);
  return await instance({
    method: "put",
    url: "/submission/result/user",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: form
  });
}
const Submission = { GetSubmission, CreateSubmission, GetAllSubmissionResult, GetSubmissionResult, UpdateSubmissionResult, GetUserSubmission, UpdateUserSubmission, CreateUserSubmission}
export default Submission;