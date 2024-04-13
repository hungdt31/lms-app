import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Kiểm tra xem req.query.id có tồn tại không trước khi sử dụng
    const folderPath = `./resources/${req.query.id}/`;
    
    // Kiểm tra xem thư mục đã tồn tại hay chưa
    fs.stat(folderPath, (err, stats) => {
      if (err) {
        // Nếu thư mục không tồn tại, tạo mới
        if (err.code === 'ENOENT') {
          fs.mkdir(folderPath, { recursive: true }, (err) => {
            throw new Error("Error creating folder");
          })
        }
      } else {
        // Thư mục đã tồn tại, tiếp tục với việc lưu trữ file
        cb(null, folderPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const uploadPdf = multer({ storage: storage });
