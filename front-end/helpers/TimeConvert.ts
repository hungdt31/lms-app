const TimeConvert = (isoDateString: string) => {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm

  const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayIndex = date.getDay();
  const dayOfWeek = daysOfWeek[dayIndex];

  const formattedDate = `${dayOfWeek} ${day}/${month}/${year}`;
  return formattedDate;
};
export default TimeConvert;
