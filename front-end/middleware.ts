import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";
// import { useAuth } from "./hooks/useAuth";
// Mảng AUTH_PAGES chứa các đường dẫn của các trang yêu cầu xác thực. 
// Trong trường hợp này, chỉ có trang "/login" được định nghĩa.
const AUTH_PAGES = ["/login"];

const isAuthPages = (url : any) => AUTH_PAGES.some((page) => page.startsWith(url));
// Hàm isAuthPages nhận một URL và kiểm tra xem nó 
// có phải là một trang yêu cầu xác thực f
// hay không bằng cách so sánh nó với các đường dẫn trong mảng AUTH_PAGES.
export async function middleware(request : any) {
  console.log("--- Middleware ---")
  const { url, nextUrl, cookies } = request;
  // console.log(cookies.getAll())
  // Trích xuất token từ cookie. 
  // Nếu không có token nào được tìm thấy, giá trị của token sẽ là null.
  const { value: token } = cookies.get("token") ?? { value: null };
  // console.log(token)
  const rs = (await verifyJwtToken(token))
  const hasVerifiedToken = token && rs;
  // const auth = await useAuth()
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);
  
  // Nếu trang được yêu cầu là một trang yêu cầu xác thực.
  if (isAuthPageRequested) {
    // Nếu không có token được xác minh, đưa người dùng đến trang chính và xóa cookie token.
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
    // Nếu có token được xác minh, đưa người dùng đến trang chính.
    const response = NextResponse.redirect(new URL(`/`, url));
    return response;
  }
  // Nếu không có token được xác minh.
  if (!hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    if (nextUrl.pathname.indexOf('/student')){
      searchParams.set("admin", "false");
    }
    else if (nextUrl.pathname.indexOf('/teacher')){
      searchParams.set("admin", "false");
    }
    else if (nextUrl.pathname.indexOf('/admin')){
      searchParams.set("admin", "true");
    }
    const response = NextResponse.redirect(
      new URL(`/login?${searchParams}`, url)
    );
    response.cookies.delete("token");
    return response;
  }
  if (rs?.role === 'STUDENT' && nextUrl.pathname.indexOf('/student') !== -1) {
    return NextResponse.next();
  }
  else if (rs?.role === 'TEACHER' && nextUrl.pathname.indexOf('/teacher') !== -1) {
    return NextResponse.next();
  }
  else if (rs?.role === 'ADMIN' && nextUrl.pathname.indexOf('/admin') !== -1) {
    return NextResponse.next();
  }
  else {
    const response = NextResponse.redirect(new URL(`/`, url));
    return response;
  }
}
export const config = { matcher: ["/login", "/student/:path*", "/admin/:path*", "/teacher/:path*"] };