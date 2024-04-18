import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import express from "express";
type UserToken = {
  _id: string;
  role: string;
};
const verifyAccessToken = asyncHandler(
  async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    if (request?.headers?.authorization?.startsWith("Bearer")) {
      const token = request.headers.authorization.split(" ")[1];
      console.log(token);
      const JWT_SECRET: any = process.env.JWT_SECRET;
      jwt.verify(token, JWT_SECRET, (err: any, decode: any) => {
        if (err)
          return response.status(401).json({
            success: false,
            mess: "Invalid access token",
          });
        console.log(decode);
        (request as any).user = decode as UserToken;
        next();
      });
    } else
      response.status(401).json({
        success: false,
        mess: "Require authentication",
      });
  },
);
const isAdmin = asyncHandler(
  async (
    request: any,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { role } = request.user;
    if (role !== "ADMIN")
      response.status(401).json({
        success: false,
        mess: "REQUIRE ADMIN ROLE",
      });
    next();
  },
);
const isTeacher = asyncHandler(
  async (
    request: any,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const { role } = request.user;
    if (role !== "TEACHER")
      response.status(401).json({
        success: false,
        mess: "REQUIRE TEACHER ROLE",
      });
    next();
  },
);
export { verifyAccessToken, isAdmin, isTeacher };
