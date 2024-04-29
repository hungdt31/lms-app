import xlsx, { IJsonSheet } from "json-as-xlsx";

export default function downloadToExcel(data : any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Students",
      columns: [
        { label: "First Name", value: "firstname" },
        { label: "Last Name", value: "lastname" },
        { label: "Email", value: "email" },
        { label: "Gender", value: "gender" },
        {
          label: "Date of Birth",
          value: (row : any) => new Date(row.date_of_birth).toLocaleDateString(),
        },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Student Excel",
  };

  xlsx(columns, settings);
}