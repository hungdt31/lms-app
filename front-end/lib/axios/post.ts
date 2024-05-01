import instance from "@/axios";

async function GetForum (id: string) {
  return instance.get(`/post/forum?id=${id}`);
}
async function GetAllNofitication () {
  return instance.get(`/post/notification/all`);
}
async function GetThread (id: string) {
  return instance.get(`/post/forum/thread?id=${id}`);
}
async function CreatePost (data : any, token : any) {
  return instance.post(`/post`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
const Post = { GetForum, GetAllNofitication, GetThread, CreatePost };
export default Post;
