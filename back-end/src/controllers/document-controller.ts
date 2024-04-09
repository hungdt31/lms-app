import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
export default class DocumentSectionController extends BaseController {
  public path = "/document-section";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllDocument);
    this.router.post(`${this.path}`, this.createDocument);
  }
  private getAllDocument = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const topics = await prisma.documentSection.findMany();
      response.json({
        mess: "Get all topic successfully !",
        success: true,
        data: topics,
      });
    },
  );
  private createDocument = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      console.log(request.body);
      const topic = await prisma.documentSection.create({
        data: request.body
      });
      response.json({
        mess: "Get all topic successfully !",
        success: true,
        data: topic,
      });
    },
  );
}
