import instance from "@/axios";

async function GetAllCate() {
  return await instance({
    method: "get",
    url: "/category",
  });
}
async function AddCate(data: any) {
  return await instance({
    method: "post",
    url: "/category",
    data,
  });
}
const Cate = { GetAllCate, AddCate };
export default Cate;
