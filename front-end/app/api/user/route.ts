import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = NextResponse.json(
    { success: true, mess: "Set token successfully !" },
    { status: 200, headers: { "content-type": "application/json" } },
  );
  response.cookies.set({
    name: "token",
    value: body,
    path: "/",
    // 7 giờ
    expires: new Date(Date.now() + 1000 * 60 * 60 * 7),
    sameSite: "strict",
  });
  return response;
}
export async function DELETE(request: Request) {
  const response = NextResponse.json(
    { success: true, mess: "Token deleted successfully !" },
    { status: 200, headers: { "content-type": "application/json" } },
  );
  response.cookies.set({
    name: "token",
    value: "", // Xóa giá trị của token
    expires: new Date(0), // Đặt thời gian hết hạn ngay lập tức
    path: "/",
    sameSite: "strict",
  });
  return response;
}
