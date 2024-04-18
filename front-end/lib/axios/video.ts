import instance from "@/axios";
async function CreateVideoSection(data : any) {
  return await instance({
    method: "post",
    url: `/video-section`,
    data
  });
}
async function DeleteVideoSection(data : any) {
  return await instance({
    method: "delete",
    url: `/video-section`,
    data
  });
}
async function UploadVideo(data : any) {
  return await instance({
    method: "post",
    url: `/video-section/add-video`,
    data
  });
}
async function DeleteVideo(data : any) {
  return await instance({
    method: "delete",
    url: `/video-section/delete-video`,
    data
  });
}
async function UpdateVideoSection(data : any, id : any) {
  return await instance({
    method: "put",
    url: `/video-section?id=${id}`,
    data
  });
}
const Video = { CreateVideoSection, DeleteVideoSection, UploadVideo, DeleteVideo, UpdateVideoSection};
export default Video;
