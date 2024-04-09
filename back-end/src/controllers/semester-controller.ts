import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
class SemesterController extends BaseController {
  public path = "/semester";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createSemester);
    this.router.get(this.path, this.getAllSemester);
    // Bạn có thể thêm put, patch, delete sau.
  }
  private createSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      if (!request.body.description) throw new Error("Description is required");
      const { description } = request.body;
      const createdSemester = await prisma.semester.create({
        data: {
          description,
          start_date: new Date(),
          // end_date - start_date = 4 months
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        },
      });
      if (!createdSemester) throw new Error("Cannot create category");
      response.json({
        message: "Created new category",
        data: createdSemester,
      });
    },
  );
  private getAllSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      const semesters = await prisma.semester.findMany();
      response.json({
        message: "Get all category",
        data: semesters,
      });
    },
  );
}
export default SemesterController;
