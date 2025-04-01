import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import {
  courseMulter,
  courseUploadMiddleware,
  deleteCloudinaryImage,
} from "../../config/cloudinary/storage";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";
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
    this.router.get(
      `${this.path}/admin`,
      [verifyAccessToken, isAdmin],
      this.getCourseByAdmin,
    );
    this.router.put(
      `${this.path}/admin`,
      [verifyAccessToken, isAdmin],
      courseMulter.single("file"),
      courseUploadMiddleware,
      this.updateCourseByAdmin,
    );
    this.router.delete(
      `${this.path}`,
      [verifyAccessToken, isAdmin],
      this.deleteCourse,
    );
    this.router.delete(
      `${this.path}/move`,
      [verifyAccessToken, isAdmin],
      this.moveUserOutCourse,
    );
    this.router.put(
      `${this.path}/add`,
      [verifyAccessToken, isAdmin],
      this.addManyUserToCourse,
    );
    // Bạn có thể thêm put, patch, delete sau.
  }

  private getAllCourse = asyncHandler(
    async (request: any, response: express.Response) => {
      const courses = await prisma.course.findMany({
        where: {
          semesterId: request.query.id,
        },
      });
      response.json({
        mess: "Get all course successfully !",
        success: true,
        data: courses,
      });
    },
  );
  private addCourse = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      // convert schedule array to number array
      request.body.credit = parseInt(request.body.credit);
      request.body.quantity = parseInt(request.body.quantity);
      if (request.body.schedule) {
        request.body.schedule = request.body.schedule.map((item: any) =>
          Number(item),
        );
      }
      let teacherId = null;
      // console.log(request.body);
      if (request.body.teacherId) {
        teacherId = request.body.teacherId;
        delete request.body.teacherId;
      }
      const course = await prisma.course.create({
        data: request.body,
      });
      if (teacherId) {
        await prisma.user.update({
          where: {
            id: teacherId,
          },
          data: {
            courseIDs: {
              push: course.id,
            },
          },
        });
        await prisma.course.update({
          where: {
            id: course.id,
          },
          data: {
            usersId: {
              push: teacherId,
            },
          },
        });
      }
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
          credit: true,
          quantity: true,
          schedule: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          date: true,
          time: true,
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
      // console.log(req.query);
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
  private getCourseByAdmin = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      const course: any = await prisma.course.findFirst({
        where: {
          id,
        },
      });
      if (!course) throw new Error("Cannot find course by id !");
      const teacher: any = await prisma.user.findFirst({
        where: {
          courseIDs: {
            has: id,
          },
          role: "TEACHER",
        },
        select: {
          id: true,
          lastname: true,
          firstname: true,
          email: true,
          avatar: true,
        },
      });
      if (teacher) {
        course.teacher = teacher;
      }
      response.json({
        success: true,
        mess: "Get course by admin successfully",
        data: course,
      });
    },
  );
  private updateCourseByAdmin = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      req.body.credit = parseInt(req.body.credit);
      req.body.quantity = parseInt(req.body.quantity);
      if (req.body.schedule) {
        req.body.schedule = req.body.schedule.map((item: any) =>
          Number(item),
        );
      }
      // console.log(req.body);
      const course: any = await prisma.course.findFirst({
        where: {
          id,
        },
      });
      if (req.body.image) {
        await deleteCloudinaryImage(course.public_id);
      }
      const updatedCourse = await prisma.course.update({
        where: {
          id,
        },
        data: req.body,
      });
      response.json({
        success: true,
        mess: "Update course by admin successfully",
        data: updatedCourse,
      });
    },
  );
  private deleteCourse = asyncHandler(
    async (req: any, response: express.Response) => {
      const { id } = req.query;
      const course: any = await prisma.course.findFirst({
        where: {
          id,
        },
      });
      if (!course) throw new Error("Cannot find course by id !");
      if (course.image && course.public_id) await deleteCloudinaryImage(course.public_id);
      await prisma.course.delete({
        where: {
          id,
        },
      });
      response.json({
        success: true,
        mess: "Delete course successfully",
      });
  })
  private moveUserOutCourse = asyncHandler(
    async (request: any, response: express.Response) => {
      let courses : any = await prisma.course.findFirst({
        where: {
          id: request.query.id
        },
        select: {
          usersId: true
        }
      })
      let {usersId} = courses
      for (let id of request.body) {
        let user = await prisma.user.findFirst({
          where: {
            id
          },
        })
        const new_courseIDs = user?.courseIDs.filter((el: any) => el != request.query.id)
        await prisma.user.update({
          where: {
            id
          },
          data: {
            courseIDs: new_courseIDs
          }
        })
        usersId = usersId.filter((el : any) => el != id)
      }
      await prisma.course.update({
        where: {
          id: request.query.id
        },
        data: {
          usersId
        }
      })
      response.json({
        mess: "Move users out course successfully !",
        success: true,
      });
    },
  );
  private addManyUserToCourse = asyncHandler(
    async (request: any, response: express.Response) => {
      const course : any = await prisma.course.findFirst({
        where: {
          id: request.query.id
        }
      })
      let {usersId} = course
      const {id} = course
      console.log(request.body)
      for (let uid of request.body) {
        usersId.push(uid)
        const user = await prisma.user.findFirst({
          where: {
            id: uid
          }
        })
        user?.courseIDs.push(id)
        await prisma.user.update({
          where: {
            id: uid
          },
          data: {
            courseIDs: user?.courseIDs
          }
        })
      }
      await prisma.course.update({
        where: {
          id
        },
        data: {
          usersId
        }
      })
      response.json({
        mess: "Add users to course successfully !",
        success: true,
      });
    },
  );
}
