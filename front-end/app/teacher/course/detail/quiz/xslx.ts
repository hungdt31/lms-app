import xlsx, { IJsonSheet } from "json-as-xlsx";

export default function downloadToExcel(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Students",
      columns: [
        { label: "Mssv", value: "mssv" },
        { label: "Name", value: "name" },
        { label: "Score list", value: (row: any) => row.score_list.join(", ") },
        { label: "Final score", value: "final_score" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Student Excel",
  };

  xlsx(columns, settings);
}
