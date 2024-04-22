const TimeConvert = (isoDateString: string): string => {
  // Tạo một đối tượng Date từ chuỗi ISO
  const date = new Date(isoDateString);

  // Mảng các tên của các ngày trong tuần
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  // Lấy thông tin ngày, tháng, năm, giờ, phút, giây và thứ trong tuần
  const day = date.getDate().toString().padStart(2, "0"); // Thêm số 0 phía trước nếu cần
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần cộng thêm 1 và thêm số 0 phía trước nếu cần
  const year = date.getFullYear().toString();
  const hour = date.getHours().toString().padStart(2, "0"); // Thêm số 0 phía trước nếu cần
  const minute = date.getMinutes().toString().padStart(2, "0"); // Thêm số 0 phía trước nếu cần
  const second = date.getSeconds().toString().padStart(2, "0"); // Thêm số 0 phía trước nếu cần
  const dayOfWeek = daysOfWeek[date.getDay()]; // Lấy tên thứ trong tuần từ mảng daysOfWeek

  // Định dạng lại chuỗi ngày giờ tháng
  const formattedDateString = `${dayOfWeek}, ${day}/${month}/${year} ${hour}:${minute}:${second}`;
  
  return formattedDateString;
};

export default TimeConvert;
