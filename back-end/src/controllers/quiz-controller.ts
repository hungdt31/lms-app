import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { kMaxLength } from "buffer";
import timeConvert from "../helper/time";
import { now } from "mongoose";
export default class QuizController extends BaseController {
  public path = "/quiz";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}`, this.createQuiz);
    this.router.get(`${this.path}`, this.getQuiz);
    this.router.put(`${this.path}`, this.updateQuiz);
    this.router.delete(`${this.path}`, this.deleteQuiz);
    this.router.post(`${this.path}` + "/question", this.addQuestion);
    this.router.delete(`${this.path}` + "/question", this.deleteQuestion);
    this.router.post(`${this.path}` + "/result", this.markQuiz);
    this.router.get(`${this.path}/result`, this.getResult);
    this.router.get(`${this.path}/all-result`, this.getAllQuizByUser);
    this.router.post(`${this.path}/start`, this.startQuiz);
    this.router.get(`${this.path}/play`, this.getPlayQuiz);
    this.router.delete(`${this.path}/play/all`, this.deleteAllPlayQuiz);
  }
  /*format create json like this
     "key1": ... ,
     "key2": ..., 
     ...
  */
  private createQuiz = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const quiz = await prisma.quiz.create({ data: request.body.quizData });

      if (!quiz) throw new Error("Cannot create quiz");

      console.log(request.body.questions);

      for (let i = 0; i < request.body.questions.length; i++) {
        request.body.questions[i].quizId = quiz.id;
        await prisma.question.create({
          data: request.body.questions[i],
        });
      }

      response.json({
        mess: "Successfully!",
        success: true,
        data: quiz,
      });
    },
  );

  /*format create json like this
    "id": ...
  */
  private getQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      const quiz = await prisma.quiz.findFirst({
        where: {
          id: request.query.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          start_date: true,
          end_date: true,
          time_limit: true,
          factor: true,
          questions: {
            select: {
              content: true,
              options: true,
            },
          },
          quizResults: true,
        },
      });

      response.json({
        mess: "Get the quiz successfully !",
        success: true,
        data: quiz,
      });
    },
  );
  /*format update json like this
  {
  query "id": "66182c11e42c33e898b6b3c4",
  "data": {
  "title": "test-update"
  }
  }
  */
  private updateQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      let quiz = await prisma.quiz.update({
        where: {
          id: request.query.id,
        },
        data: request.body.data,
      });

      response.json({
        mess: "Update uccessfully!",
        success: true,
        data: quiz,
      });
    },
  );
  /*format delete json like this
    "id": ...
  */
  private deleteQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      let deleted = await prisma.quiz.delete({
        where: {
          id: request.query.id,
        },
        select: {
          id: true,
        },
      });

      response.json({
        mess: "Delete quiz successfully !",
        success: true,
        data: deleted,
      });
    },
  );
  /*format add json like this
   questionSchema
  */
  private addQuestion = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const question = await prisma.question.create({ data: request.body });

      let quiz = await prisma.quiz.findFirst({
        where: {
          id: question.quizId,
        },
        select: {
          questions: true,
        },
      });

      if (quiz) {
        quiz.questions.push(question);
      }

      response.json({
        mess: "Add question successfully !",
        success: true,
        data: question,
      });
    },
  );
  /*format delete json like this
    "id": ...
  */
  private deleteQuestion = asyncHandler(
    async (request: any, response: express.Response) => {
      let deleted = await prisma.question.delete({
        where: {
          id: request.query.id,
        },
        select: {
          id: true,
        },
      });
      if (!deleted) throw new Error("Can't delete question!");
      response.json({
        mess: "Delete question successfully !",
        success: true,
        data: deleted,
      });
    },
  );
  /*format calc result 
   {
    "userId:"
    "quizId:"
    "answer:" String[]
   }
  */
  private markQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      ///làm ra cái điểm
      console.log(request.body)
      const solution = await prisma.quiz.findFirst({
        where: {
          id: request.body.quizId,
        },
        select: {
          questions: {
            select: {
              answer: true,
            },
          },
        },
      });

      if (!solution) throw new Error("Error!");

      let score = 0;
      for (let i = 0; i < solution.questions.length; i++) {
        console.log(
          solution.questions[i].answer + " " + request.body.answer[i] + "\n",
        );
        if (solution.questions[i].answer == request.body.answer[i]) score++;
      }

      score = (score / solution.questions.length) * 10;
      //console.log(score);
      let result;
      const foundResult = await prisma.quizResult.findFirst({
        where: {
          userId: request.body.userId,
          quizId: request.body.quizId,
        },
        select: {
          score: true,
          id: true,
        },
      });
      if (foundResult) {
        foundResult.score.push(score);
        result = await prisma.quizResult.update({
          where: {
            id: foundResult.id,
          },
          data: {
            score: foundResult.score,
          },
        });
      } else {
        result = await prisma.quizResult.create({
          data: {
            userId: request.body.userId,
            quizId: request.body.quizId,
            score: [score],
          },
        });
      }
      const answers = request.body.answer.map((item : any )=> item === null ? "" : item);
      await prisma.playQuiz.update({
        where: {
          id: request.body.playId,
        },
        data: {
          isDone: true,
          score: score,
          timeFinished: new Date(),
          timeFinishedString: timeConvert(new Date().toISOString()),
          answers,
        },
      });
      response.json({
        mess: "Your result has been saved!",
        success: true,
        data: result,
      });
    },
  );
  private startQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id, uid } = request.body;
      const quiz: any = await prisma.quiz.findFirst({
        where: {
          id,
        },
        select: {
          start_date: true,
          end_date: true,
          time_limit: true,
        },
      });
      if (!quiz) throw new Error("Can't find the quiz!");
      const now = new Date();
      if (now < quiz?.start_date) throw new Error("Quiz has not started yet!");
      if (now > quiz?.end_date) throw new Error("Quiz has ended!");
      let foundResult = await prisma.quizResult.findFirst({
        where: {
          userId: uid,
          quizId: id,
        },
      });
      // console.log(foundResult)
      if (!foundResult) {
        foundResult = await prisma.quizResult.create({
          data: {
            userId: uid,
            quizId: id,
          },
        });
      }
      // console.log(timeConvert((new Date(now.getTime())).toISOString()))
      // console.log(timeConvert((new Date(now.getTime() + quiz?.time_limit)).toISOString()))
      const played = await prisma.playQuiz.create({
        data: {
          timeEnded: new Date(now.getTime() + quiz?.time_limit),
          quizResultId: foundResult.id,
          timeEndedString: timeConvert(
            new Date(now.getTime() + quiz?.time_limit).toISOString(),
          ),
          timeStarted: now,
          timeStartedString: timeConvert(now.toISOString()),
        },
      });
      response.json({
        mess: "Your quiz playing is started!",
        success: true,
        data: played,
      });
    },
  );
  private getResult = asyncHandler(
    async (request: any, response: express.Response) => {
      const result = await prisma.quizResult.findFirst({
        where: {
          id: request?.query.id,
        },
      });
      if (!result) throw new Error("Can't find your result!");
      response.json({
        mess: "Your result has been given!",
        success: true,
        data: result,
      });
    },
  );
  private getPlayQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      const result = await prisma.playQuiz.findFirst({
        where: {
          quizResult: {
            quizId: request.query.id,
          },
          timeEnded: {
            gt: now(),
          },
          isDone: false,
        },
      });
      response.json({
        mess: result ? "Your quiz playing has been exist!" : "Nothing to play!",
        success: true,
        data: result,
      });
    },
  );
  private getAllQuizByUser = asyncHandler(
    async (request: any, response: express.Response) => {
      const result = await prisma.quizResult.findMany({
        where: {
          userId: request.query?.uid,
          quiz: {
            documentSection: {
              courseId: request.query?.cid,
            },
          },
        },
        select: {
          createdAt: true,
          updatedAt: true,
          quiz: {
            select: {
              title: true,
              factor: true,
            },
          },
          score: true,
        },
      });
      if (!result) throw new Error("Can't find your result!");
      response.json({
        mess: "Your result has been given!",
        success: true,
        data: result,
      });
    },
  );
  private deleteAllPlayQuiz = asyncHandler(
    async (request: any, response: express.Response) => {
      const result = await prisma.playQuiz.deleteMany();
      response.json({
        mess: "All your quiz playing has been deleted!",
        success: true,
        data: result,
      });
    },
  );
}
