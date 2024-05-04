import xlsx, { IJsonSheet } from "json-as-xlsx";

export default function downloadToExcel(_data: any) {
  let data = [..._data];
  let columns: IJsonSheet[] = [
    {
      sheet: "Users",
      columns: [
        { label: "First name", value: "firstname" },
        { label: "Last name", value: "lastname" },
        { label: "Email", value: "email" },
        { label: "Gender", value: "gender" },
        { label: "Date of birth", value: "date_of_birth" },
        { label: "Phone", value: "phone" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "User Excel",
  };

  xlsx(columns, settings);
}
