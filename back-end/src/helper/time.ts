const timeConvert = (isoString: string): string => { 
  const date: Date = new Date(isoString);

  // Lấy các thành phần của ngày tháng năm giờ phút giây
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1; // Tháng trong JavaScript tính từ 0 đến 11, nên cần cộng thêm 1
  const year: number = date.getFullYear();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();
  const second: number = date.getSeconds();

  // Định dạng lại thành chuỗi ngày tháng năm giờ phút giây
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}
export default timeConvert