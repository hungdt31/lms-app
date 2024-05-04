import xlsx, { IJsonSheet } from "json-as-xlsx";

export default function downloadToExcel(data : any, courseInfo : any) {
  let columns: IJsonSheet[] = [
    {
      sheet: `Students and teachers of course`,
      columns: [
        { label: "Mssv", value: "mssv" },
        { label: "Role", value: "role" },
        { label: "First name", value: "firstname" },
        { label: "Last name", value: "lastname" },
        { label: "Phone", value: "phone" },
        { label: "Email", value: "email" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: `${courseInfo.title}_${courseInfo.course_id} Excel [${courseInfo.semester.description}]`,
  };

  xlsx(columns, settings);
}