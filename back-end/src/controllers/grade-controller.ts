import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { verifyAccessToken } from "../middlewares/verifyToken";

export default class GradeController extends BaseController {
  public path = "/grade";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //trang grade trong course cua hs
    this.router.get(this.path + "/course/user", this.getUserCourseResult);
    //cua gv
    this.router.get(this.path + "/course", this.getAllUserCourseResult);
    //gv nhap diem
    this.router.put(this.path + "/course", this.updateCourseResult);
    //lay diem theo ki cho trang diem so sinh vien
    this.router.get(this.path, this.getUserResultByFilter);
    //lay ket qua khoa hoc cua sinh vien
    this.router.get(this.path + "/course/result", this.getCourseResult);
    //lay ket qua quiz va nop bai
    this.router.get(this.path + "/quiz-submit", [verifyAccessToken], this.getQuizResultAndSubmit);
  }
  /* json
    courseId
    userId
  */
  private getUserCourseResult = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const result = await prisma.course.findFirst({
        where: {
          id: request.body.courseId,
          usersId: { has: request.body.userId },
        },
        select: {
          courseResults: {
            where: {
              userId: request.body.userId,
            },
            select: {
              score_array: true,
              average_score: true,
            },
          },
        },
      });

      if (!result) throw new Error("Can't get course result");

      response.json({
        mess: "Get course result successfully !",
        success: true,
        data: result,
      });
    },
  );
  /* json: query: id */
  private getAllUserCourseResult = asyncHandler(
    async (request: any, response: express.Response) => {
      const result = await prisma.courseResult.findMany({
        where: {
          courseId: request.query.id,
        },
        select: {
          userId: true,
          score_array: true,
        },
      });

      if (!result) throw new Error("Can't get course result");

      response.json({
        mess: "Get all course result successfully !",
        success: true,
        data: result,
      });
    },
  );
  //update nguyên một course
  /* json:
    query courseId: ****,
    body 
    data: [
      { userId: ...,
        score_array: [...]
      },
      {},
      ...
    ]
  */
  private updateCourseResult = asyncHandler(
    async (request: any, response: express.Response) => {
      let UpdateData: Object[] = [];
      console.log(request.body);
      let location = await prisma.courseResult.findFirst({
        where: {
          courseId: request.body.courseId,
          userId: request.body.userId,
        },
        select: {
          id: true,
        },
      });
      if (!location)
        location = await prisma.courseResult.create({
          data: {
            courseId: request.body.courseId,
            userId: request.body.userId,
          },
          select: {
            id: true,
          },
        });

      let factor = await prisma.course.findFirst({
        where: {
          id: request.body.courseId,
        },
        select: {
          score_factor: true,
        },
      });

      if (!factor) throw new Error("Update average score fail");
      let average = 0;
      for (let j = 0; j < factor.score_factor.length; j++) {
        average += request.body.score_array[j] * factor.score_factor[j];
      }

      let result = await prisma.courseResult.update({
        where: {
          id: location.id,
        },
        data: {
          score_array: request.body.score_array,
          average_score: average,
        },
      });

      if (!result) throw new Error("Update score array fail");
      else UpdateData.push(result);

      response.json({
        mess: "Update result successfully !",
        success: true,
        data: UpdateData,
      });
    },
  );
  /* json 
   body: userId, semesterId
  */
  private getUserResultByFilter = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const filter = request.body;
      let listResult, course;
      if (!filter.semesterId) {
        listResult = await prisma.courseResult.findMany({
          where: filter.userId,
        });
      } else {
        const course = await prisma.course.findMany({
          where: {
            semesterId: filter.semesterId,
            usersId: {
              has: filter.userId,
            },
          },
          select: {
            id: true,
            title: true,
          },
        });

        const courseId = course.map((a) => a.id);
        console.log(course);

        listResult = await prisma.courseResult.findMany({
          where: {
            courseId: { in: courseId },
            userId: filter.userId,
          },
          select: {
            score_array: true,
            average_score: true,
          },
        });
        listResult = [course, listResult];
      }

      if (!listResult) throw new Error("Cannot find course by filter !");

      response.json({
        success: true,
        mess: "Find all grade successfully",
        data: listResult,
      });
    },
  );
  private getCourseResult = asyncHandler(
    async (request: any, response: express.Response) => {
      const { uid, cid } = request.query;
      const courseResult = await prisma.courseResult.findFirst({
        where: {
          userId: uid,
          courseId: cid,
        },
        select: {
          course: true,
          score_array: true,
          average_score: true,
          user: true,
        },
      });

      if (!courseResult) throw new Error("Cannot find course result !");

      response.json({
        success: true,
        mess: "Get score result successfully",
        data: courseResult,
      });
    },
  );
  private getQuizResultAndSubmit = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      const uid = request.user._id;
      const quizResult = await prisma.quizResult.findMany({
        where: {
          userId: uid,
          quiz: {
            documentSection: {
              courseId: id
            }
          }
        },
        select: {
          id: true,
          total_score: true,
          quiz: {
            select: {
              id: true,
              title: true,
              factor: true,
            }
          },
        },
      });
      const submitResult = await prisma.userSubmission.findMany({
        where: {
          userId: uid,
          submission: {
            documentSection: {
              courseId: id
            }
          }
        },
        select: {
          id: true,
          score: true,
          submission: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });
      response.json({
        success: true,
        mess: "Get score result successfully",
        data: {
          quizResult,
          submitResult
        },
      });
    },
  );
}
