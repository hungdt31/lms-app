import xlsx, { IJsonSheet } from "json-as-xlsx";

export default function downloadToExcel(_data: any) {
  let data = [..._data]
  for (let i = 0; i < data.length; i++) {
    data[i].usersId = data[i].usersId ? "Đã đăng ký" : "Chưa đăng ký";
    data[i].schedule = data[i].schedule.join(", ");
    data[i]._count = `${data[i]._count.users} / ${data[i].quantity}`;
  }
  let columns: IJsonSheet[] = [
    {
      sheet: "Courses",
      columns: [
        { label: "Tên khóa học", value: "title" },
        { label: "Mã môn học", value: "course_id" },
        { label: "Tuần học", value: "schedule" },
        { label: "Ngày học", value: "date" },
        { label: "Giờ học", value: "time" },
        { label: "Số lượng học viên", value: "_count" },
        { label: "Tình trạng", value: "usersId" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Course Excel",
  };

  xlsx(columns, settings);
}
