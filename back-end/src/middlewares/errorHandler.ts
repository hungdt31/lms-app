import { ErrorRequestHandler } from "express";
import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found !`);
  res.status(404);
  next(err);
};

const errHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    mess: err?.message,
  });
};

export default [notFound, errHandler];
