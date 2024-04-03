import instance from "@/axios";

interface User {
  email: string;
  password: string;
}
interface UpdateUser {
  email: string;
  username: string;
  old_password: string;
  new_password: string;
}
async function Login(data: User) {
  return await instance({
    method: "post",
    url: "/user/login",
    data,
  });
}
async function GetCurrentUser(data: string) {
  return await instance({
    method: "get",
    url: "/user/current",
    headers: {
      Authorization: "Bearer " + data,
    },
  });
}
async function GetAllUser(data: string) {
  return await instance({
    method: "get",
    url: "/user",
    headers: {
      Authorization: "Bearer " + data,
    },
  });
}
async function ChangePassword(data: UpdateUser) {
  return await instance({
    method: "put",
    url: "/user/change-password",
    data,
  });
}
async function SendMail(data: any) {
  return await instance({
    method: "post",
    url: "/user/reset-password",
    data,
  });
}
async function VerifyCodeFromEmail(reset_code: any) {
  return await instance({
    method: "get",
    url: `/user/reset-password/${reset_code}`,
  });
}
async function UpdatePassword(data: any) {
  return await instance({
    method: "put",
    url: "/user/reset-password",
    data,
  });
}
async function UpdateAvatar(token : string, avatar: string){
  const form = new FormData()
  form.append("file",avatar)
  return await instance({
    method: "put",
    url: "/user/update-avatar",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
    data: form
  });
}
const User = {
  Login,
  GetCurrentUser,
  GetAllUser,
  ChangePassword,
  SendMail,
  VerifyCodeFromEmail,
  UpdatePassword,
  UpdateAvatar
};
export default User;