import instance from "@/axios";

async function GetForum(id: string) {
  return instance.get(`/post/forum?id=${id}`);
}
async function GetAllNofitication() {
  return instance.get(`/post/notification/all`);
}
async function GetThread(id: string) {
  return instance.get(`/post/forum/thread?id=${id}`);
}
async function CreatePost(data: any, token: any) {
  return instance.post(`/post`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
async function createNotification(data: any, token: any) {
  return instance.post(`/post/notification`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
async function deletePost(data: any, token: any) {
  return instance.delete(`/post`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
async function updatePost(data: any, id: any, token: any) {
  return instance.put(`/post?id=${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
async function deleteNotification(data: any, token: any) {
  return instance.delete(`/post/notification`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
async function GetForumByCourse(id: string) {
  return instance.get(`/post/forum/course?id=${id}`);
}
async function CreateForum(data: any) {
  return instance.post(`/post/forum`, data);
}
async function DeleteForum(data: any, token: any) {
  return instance.delete(`/post/forum`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}
async function CreateThread(data: any) {
  return instance.post(`/post/forum/thread`, data);
}
async function DeleteThread(data: any) {
  return instance.delete(`/post/forum/thread`, {
    data,
  });
}
async function DeleteSinglePost(id: any) {
  return instance.delete(`/post/single?id=${id}`);
}
async function GetThreadBreadcum(id: string) {
  return instance.get(`/post/forum/thread/breadcrumb?id=${id}`);
}
const Post = {
  GetForum,
  GetAllNofitication,
  GetThread,
  CreatePost,
  deletePost,
  updatePost,
  createNotification,
  deleteNotification,
  GetForumByCourse,
  CreateForum,
  DeleteForum,
  CreateThread,
  DeleteThread,
  DeleteSinglePost,
  GetThreadBreadcum,
};
export default Post;
