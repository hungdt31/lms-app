import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { kMaxLength } from "buffer";

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
      if (!deleted) throw new Error("Can't delete question!")
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
      console.log(score);

      const result = await prisma.quizResult.create({
        data: {
          userId: request.body.userId,
          quizId: request.body.quizId,
          score: score,
        },
      });

      response.json({
        mess: "Your result has been saved!",
        success: true,
        data: result,
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
}
