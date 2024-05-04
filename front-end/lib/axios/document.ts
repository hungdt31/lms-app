import instance from "@/axios";
type DocsType = {
  title: string;
  content: string;
  courseId: string;
};
async function CreateNewDocs(data: DocsType) {
  return await instance({
    method: "post",
    url: "/document-section",
    data,
  });
}
async function UploadPdf(id: string, data: any) {
  const form: any = new FormData();
  form.append("file", data.file);
  form.append("title", data.title);
  form.append("description", data.description);
  return await instance({
    method: "post",
    url: `/document-section/upload?id=${id}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: form,
  });
}
async function DeleteDocumentSection(data: any) {
  return await instance({
    method: "delete",
    url: `/document-section`,
    data,
  });
}
async function DeleteQuizAndDocumentLink(data: any) {
  return await instance({
    method: "delete",
    url: `/document-section/document-link-and-quiz`,
    data,
  });
}
async function UpdateDocumentSection(data: any, id: any) {
  return await instance({
    method: "put",
    url: `/document-section?id=${id}`,
    data,
  });
}
const Docs = {
  CreateNewDocs,
  UploadPdf,
  DeleteDocumentSection,
  DeleteQuizAndDocumentLink,
  UpdateDocumentSection,
};
export default Docs;
