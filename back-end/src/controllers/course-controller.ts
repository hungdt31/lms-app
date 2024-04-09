import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { courseMulter, courseUploadMiddleware} from "../../cloudinary/storage";
import { verifyAccessToken } from "../middlewares/verifyToken";
export default class CourseController extends BaseController {
  public path = "/course";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path + "/my",
      [verifyAccessToken],
      this.getAllCourseWithUserId,
    );
    this.router.get(this.path, this.getAllCourse);
    this.router.get(this.path + "/detail",[verifyAccessToken], this.getCourseById)
    this.router.post(this.path, courseMulter.single('file'),  courseUploadMiddleware, this.addCourse);
    this.router.put(this.path + "/add-student",  this.addStudent);
    // Bạn có thể thêm put, patch, delete sau.
  }
  // private uploadFile = asyncHandler(
  //   async (request: express.Request, response: express.Response) => {
  //     const cloudinaryUrls = request.body.cloudinaryUrls;
  //     const info = request.body
  //       if (cloudinaryUrls.length === 0) {
  //           console.error('No Cloudinary URLs found.');
  //           throw new Error('Internal Server Error');
  //       }
  //      const images = cloudinaryUrls;
  //      response.json({
  //       images,
  //       info
  //      })
  //   })
  private getAllCourse = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const courses = await prisma.course.findMany();
      response.json({
        mess: "Get all course successfully !",
        success: true,
        data: courses,
      });
    },
  );
  private addCourse = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const course = await prisma.course.create({
        data: request.body,
      });
      response.json({
        mess: "Created new course successfully !",
        success: true,
        data: course,
      });
    },
  );
  private getCourseById = asyncHandler(
    async (request: any, response: express.Response) => {
      const {_id} = request.user
      const {id} = request.query
      const course : any = await prisma.course.findUnique({
        where:{
          id 
        }
      })
      if (!course) throw new Error("Cannot find the course !");
      if (course?.usersId.includes(_id)) {
        course.registered = true
        response.json({
          mess: "Registered for the course !",
          success: true,
          data: course,
        });
      }
      course.registered = false
      response.json({
        mess: "Haven't registered for the course yet !",
        success: true,
        data: course,
      });
    },
  );
  private addStudent = asyncHandler(
    async (req: any, response: express.Response) => {
      const { uid, cid } = req.query;
      if (!uid) throw new Error("No student attends course");
      try {
        const course: any = await prisma.course.findFirst({
          where: {
            id: cid,
          },
          select: {
            usersId: true,
          },
        });
        const user = await prisma.user.findFirst({
          where: {
            id: uid,
          },
        });
        if (!course || !user) throw new Error("Can't find course by id ...");
        const {courseIDs} = user;
        const { usersId } = course;
        usersId.push(uid);
        courseIDs.push(cid);
        await prisma.user.update({
          where: {
            id: uid,
          },
          data: {
            courseIDs,
          },
        });
        const updatedCourse = await prisma.course.update({
          where: {
            id: cid,
          },
          data: {
            usersId,
          },
        });
        response.json({
          success: true,
          mess: "Add student to course successfully !",
          data: updatedCourse,
        });
      } catch (e: any) {
        throw new Error(e);
      }
    },
  );
  private getAllCourseWithUserId = asyncHandler(
    async (req: any, response: express.Response) => {
      const { _id } = req.user;
      console.log(_id)
      const course = await prisma.course.findMany({
        where: {
          usersId: {
            has: _id,
          },
        },
      });
      //console.log(course)
      response.json({
        success: true,
        mess: "Get all course subscribed successfully",
        data: course,
      });
    },
  );
}
