import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import {
  courseMulter,
  courseUploadMiddleware,
} from "../../config/cloudinary/storage";
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
    this.router.get(`${this.path}`, this.getAllCourse);
    this.router.get(
      `${this.path}/detail`,
      [verifyAccessToken],
      this.getCourseById,
    );
    this.router.post(
      `${this.path}`,
      courseMulter.single("file"),
      courseUploadMiddleware,
      this.addCourse,
    );
    this.router.put(
      `${this.path}/add-student`,
      [verifyAccessToken],
      this.addStudent,
    );
    this.router.post(`${this.path}/filter`, this.getCourseByFilter);
    this.router.get(`${this.path}/score-factor`, this.getScoreFactor);
    this.router.get(`${this.path}/quiz`, this.getCourseByQuizId);
    this.router.get(`${this.path}/submission`, this.getCourseBySubmissionId);
    // Bạn có thể thêm put, patch, delete sau.
  }

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
      const { _id } = request.user;
      const { id } = request.query;
      const course: any = await prisma.course.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          usersId: true,
          image: true,
          public_id: true,
          course_id: true,
          DocumentSections: {
            select: {
              id: true,
              title: true,
              content: true,
              quiz: true,
              documentLink: true,
              submissions: true,
            },
          },
          VideoSections: {
            select: {
              id: true,
              title: true,
              description: true,
              videos: true,
            },
          },
          forum: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      // if (!course) throw new Error("Cannot find the course !");
      if (course?.usersId.includes(_id)) {
        const teacher = await prisma.user.findFirst({
          where: {
            courseIDs: {
              has: id,
            },
            role: "TEACHER",
          },
          select: {
            lastname: true,
            firstname: true,
            email: true,
            avatar: true,
          },
        });
        course.teacher = teacher;
        course.registered = true;
        response.json({
          mess: "Registered for the course !",
          success: true,
          data: course,
        });
      } else {
        course.registered = false;
        response.json({
          mess: "Haven't registered for the course yet !",
          success: true,
          data: course,
        });
      }
    },
  );
  private addStudent = asyncHandler(
    async (req: any, response: express.Response) => {
      let arr = [];
      for (const id of req.body) {
        const course: any = await prisma.course.findFirst({
          where: {
            id,
          },
          select: {
            usersId: true,
          },
        });
        const user = await prisma.user.findFirst({
          where: {
            id: req.user._id,
          },
        });
        if (!course || !user)
          throw new Error("Can't continue to add student !");
        const { courseIDs } = user;
        const { usersId } = course;
        usersId.push(req.user._id);
        courseIDs.push(id);
        await prisma.user.update({
          where: {
            id: req.user._id,
          },
          data: {
            courseIDs,
          },
        });
        const updatedCourse = await prisma.course.update({
          where: {
            id,
          },
          data: {
            usersId,
          },
        });
        arr.push(updatedCourse);
      }
      response.json({
        success: true,
        mess: "Add student to course successfully !",
        data: arr,
      });
    },
  );
  private getAllCourseWithUserId = asyncHandler(
    async (req: any, response: express.Response) => {
      const { _id } = req.user;
      console.log(req.query);
      const take = Number(process.env.TAKE);
      const { cate_id, semester_id, name, name_sort } = req.query;
      let page = Number(req.query.page);
      const coursePage = await prisma.course.count({
        where: {
          usersId: {
            has: _id,
          },
          categoryId: cate_id != "all" ? cate_id : undefined,
          semesterId: semester_id != "all" ? semester_id : undefined,
          title: {
            contains: name ? name : "",
          },
        },
      });
      const count = Math.ceil(coursePage / take);
      if (page > count) page = 1;
      const course: any = await prisma.course.findMany({
        take,
        skip: (page - 1) * take,
        where: {
          usersId: {
            has: _id,
          },
          categoryId: cate_id != "all" ? cate_id : undefined,
          semesterId: semester_id != "all" ? semester_id : undefined,
          title: {
            contains: name ? name : "",
          },
        },
        orderBy: {
          title: name_sort ? name_sort : "asc",
        },
      });
      response.json({
        success: true,
        mess: "Get all course subscribed successfully",
        data: {
          course,
          count,
        },
      });
    },
  );
  private getCourseByFilter = asyncHandler(
    async (req: any, response: express.Response) => {
      const filter = req.body;
      let course;
      if (!filter.userId) {
        course = await prisma.course.findMany({
          where: filter,
        });
      } else {
        course = await prisma.course.findMany({
          where: {
            semesterId: filter.semesterId,
            usersId: {
              has: filter.userId,
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            usersId: true,
            image: true,
            course_id: true,
            semester: true,
            category: true,
          },
        });
      }
      if (!course) throw new Error("Cannot find course by filter !");
      response.json({
        success: true,
        mess: "Find courses successfully",
        data: course,
      });
    },
  );
  private getScoreFactor = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      const course = await prisma.course.findFirst({
        where: {
          id,
        },
        select: {
          score_factor: true,
          name_factor: true,
        },
      });
      if (!course) throw new Error("Cannot find course by id !");
      response.json({
        success: true,
        mess: "Get score factor successfully",
        data: course,
      });
    },
  );
  private getCourseByQuizId = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      let course = null;
      course = await prisma.course.findFirst({
        where: {
          DocumentSections: {
            some: {
              quiz: {
                some: {
                  id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });
      if (!course) {
        course = await prisma.course.findFirst({
          where: {
            DocumentSections: {
              some: {
                quiz: {
                  some: {
                    quizResults: {
                      some: {
                        history: {
                          some: {
                            id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            title: true,
          },
        });
        const play_quiz = await prisma.playQuiz.findFirst({
          where: {
            id,
          },
          select: {
            id: true,
            timeFinishedString: true,
          },
        });
        const quiz = await prisma.quiz.findFirst({
          where: {
            quizResults: {
              some: {
                history: {
                  some: {
                    id,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            title: true,
          },
        });
        course = [course, quiz, play_quiz];
      } else {
        const quiz = await prisma.quiz.findFirst({
          where: {
            id,
          },
          select: {
            id: true,
            title: true,
          },
        });
        course = [course, quiz];
      }
      response.json({
        success: true,
        mess: "Get course by quiz id successfully",
        data: course,
      });
    },
  );
  private getCourseBySubmissionId = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      let course = null;
      course = await prisma.course.findFirst({
        where: {
          DocumentSections: {
            some: {
              submissions: {
                some: {
                  id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });
      const submission = await prisma.submission.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
        },
      });
      if (!course) throw new Error("Cannot find course by id !");
      course = [course, submission];
      response.json({
        success: true,
        mess: "Get score factor successfully",
        data: course,
      });
    },
  );
}
