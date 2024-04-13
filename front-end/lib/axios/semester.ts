import instance from "@/axios";

async function GetAllSemester() {
  return await instance({
    method: "get",
    url: "/semester",
  });
}
const Semester = { GetAllSemester };
export default Semester;
