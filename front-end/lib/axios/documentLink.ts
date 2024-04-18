import instance from "@/axios";
async function DeleteDocumentLink(data: any) {
  return await instance({
    method: "delete",
    url: `/document-link`,
    data,
  });
}
const DocLinks = { DeleteDocumentLink };
export default DocLinks;
