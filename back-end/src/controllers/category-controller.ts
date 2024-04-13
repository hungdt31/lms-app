import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { cateMulter, cateUploadMiddleware } from "../../config/cloudinary/storage";
class CategoryController extends BaseController {
  public path = "/category";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      cateMulter.single("file"),
      cateUploadMiddleware,
      this.createCategory,
    );
    this.router.get(this.path, this.getAllCategory);
    // Bạn có thể thêm put, patch, delete sau.
  }
  private createCategory = asyncHandler(
    async (request: any, response: express.Response) => {
      if (!request.body.name) throw new Error("Name is required");
      const createdCategory = await prisma.category.create({
        data: request.body,
      });
      if (!createdCategory) throw new Error("Cannot create category");
      response.json({
        message: "Created new category",
        data: createdCategory,
      });
    },
  );
  private getAllCategory = asyncHandler(
    async (request: any, response: express.Response) => {
      const categories = await prisma.category.findMany();
      response.json({
        message: "Get all category",
        data: categories,
      });
    },
  );
}
export default CategoryController;
