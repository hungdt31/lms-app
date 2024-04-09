import instance from "@/axios";

async function GetAllCate() {
  return await instance({
    method: "get",
    url: "/category",
  });
}
const Cate = { GetAllCate };
export default Cate;
