import { NextResponse } from "next/server";
import { getJwtSecretKey } from "@/lib/auth";
import { SignJWT } from "jose";
export async function POST(request: Request) {
  const body = await request.json();
  // get query from url
  const url = new URL(request.url);
  const query: string = url.searchParams.get("time") as string;
  console.log(query);
  const response = NextResponse.json(
    { success: true, mess: "Set token successfully !" },
    { status: 200, headers: { "content-type": "application/json" } },
  );
  const token = await new SignJWT({
    time: query,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30s")
    .sign(getJwtSecretKey());
  response.cookies.set({
    name: "time",
    value: token,
    path: "/",
    sameSite: "strict",
  });
  return response;
}
