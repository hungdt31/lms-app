# Learning Management System (LMS)

Hệ thống quản lý học tập trực tuyến hiện đại, giúp kết nối giảng viên và sinh viên một cách hiệu quả.

Link video youtube thuyết trình: [Demo LMS App](https://www.youtube.com/watch?v=88FWH8TZHyg)

Báo cáo: [sdflim857_LMS_APP_BTL_LTNC_Report.pdf](./sdflim857_LMS_APP_BTL_LTNC_Report.pdf)

## I. Công nghệ sử dụng

### Frontend

- **Next.js 14** - Framework React với Server Side Rendering
- **TypeScript** - Ngôn ngữ lập trình type-safe
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Thư viện components có thể tái sử dụng
- **Axios** - Thư viện HTTP Client
- **React Hook Form** - Quản lý form và validation
- **Zod** - Schema validation

### Backend

- **Express** - Fast, unopinionated, minimalist web framework for Node.js
- **Prisma** - ORM hiện đại cho Node.js và TypeScript
- **MongoDB** - Một cơ sở dữ liệu NoSQL mã nguồn mở, sử dụng mô hình document-oriented (hướng tài liệu)
- **JWT** - JSON Web Token cho xác thực
- **Firebase** - Nền tảng Backend-as-a-Service (BaaS) do Google phát triển

## II. Cài đặt và Chạy dự án

### Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm hoặc yarn

### Cài đặt Frontend

```bash
cd front-end
npm install
cp .env-example .env # Cấu hình biến môi trường
npm run dev
```

### Cài đặt Backend

```bash
cd back-end
npm install
cp .env-example .env # Cấu hình biến môi trường
npx prisma migrate dev # Chạy migration database
npm run start:dev
```

## III. Tính năng đã đạt được

### Quản trị viên

- Quản lý người dùng (giảng viên, sinh viên)
- Quản lý khóa học và chương trình học
- Phân quyền và kiểm soát truy cập
- Thống kê và báo cáo

### Giảng viên

- Tạo và quản lý khóa học
- Upload tài liệu giảng dạy
- Tạo bài kiểm tra, đánh giá
- Theo dõi tiến độ học tập của sinh viên

### Sinh viên

- Đăng ký và tham gia khóa học
- Xem tài liệu học tập
- Làm bài kiểm tra
- Theo dõi kết quả học tập

## IV. Hạn chế và Hướng phát triển

### Hạn chế hiện tại

- Chưa có tính năng học trực tuyến real-time
- Chưa hỗ trợ đa ngôn ngữ
- Giao diện mobile cần được cải thiện
- Chưa có tính năng backup dữ liệu tự động

### Hướng phát triển

- Thêm tính năng video conference
- Tích hợp AI để gợi ý học tập
- Phát triển mobile app
- Tối ưu hóa hiệu suất
- Thêm tính năng thanh toán trực tuyến

## V. Thành viên nhóm

### Phát triển

- **Đoàn Trí Hùng** (MSSV: 2211322, Lớp: L08) - Team Leader & Fullstack Developer  
- **Quách Thanh Điền** (MSSV: 22110754, Lớp: L01)  - Backend Developer
- **Đỗ Phú Vinh Hiền** (MSSV: 2211035, Lớp: L01)  - Frontend Developer
- **Nguyễn Huỳnh Hải Đăng** (MSSV: 2210737, Lớp: L01) - Frontend Developer
- **Hồ Nguyễn Phi Hùng** (MSSV: 2211327, Lớp: L01) - Backend Developer
- **Phạm Duy Hùng** (MSSV: 2211347, Lớp: L08) - Frontend Developer

### Mentor

- **Thầy Mai Đức Trung** - Giảng viên hướng dẫn
  - Khoa KH&KT Máy tính - Trường Đại học Bách Khoa TP.HCM

## VI. Tài liệu tham khảo

- **[Next.js - Framework React cho ứng dụng web.](https://nextjs.org/docs)**  

- **[Prisma - ORM hiện đại cho cơ sở dữ liệu.](https://www.prisma.io/docs)**  

- **[Tailwind CSS - Framework CSS utility-first.](https://tailwindcss.com/docs)**  

- **[Shadcn/ui - Thành phần UI tùy chỉnh cho React.](https://ui.shadcn.com/)**  

- **[Firebase - Nền tảng phát triển ứng dụng của Google.](https://firebase.google.com)**  

- **[MongoDB Atlas - Dịch vụ cơ sở dữ liệu đám mây](https://www.mongodb.com/products/platform/atlas-database)**  
