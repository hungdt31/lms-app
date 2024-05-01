import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { verify } from "crypto";
import { verifyAccessToken } from "../middlewares/verifyToken";

export default class PostController extends BaseController {
  public path = "/post";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/notification/all`, this.getAllNotification);
    this.router.post(`${this.path}`, [verifyAccessToken], this.createPost);
    this.router.post(`${this.path}/forum`, this.createForum);
    this.router.get(`${this.path}/forum`, this.getForum);
    this.router.post(`${this.path}/forum/thread`, this.createThread);
    this.router.get(`${this.path}/forum/thread`, this.getThread);
    this.router.post(`${this.path}/notification`, this.createNotification);
    this.router.get(`${this.path}/notification`, this.getNotification);
  }
  /*format create json like the model
   */
  private createPost = asyncHandler(
    async (request: any, response: express.Response) => {
      
      const user : any = await prisma.user.findFirst({
        where: {
          id: request.user._id,
        },
        select: {
          lastname: true,
          firstname: true
        },
      });
      request.body.sender = user.firstname + " " + user.lastname;
      request.body.userId = request.user._id;
      const post = await prisma.post.create({ data: request.body });

      if (!post) throw new Error("Cannot create post");
      if (request.body.threadId)
        await prisma.thread.update({
          where: {
            id: request.body.threadId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      if (request.body.notificationId)
        await prisma.notification.update({
          where: {
            id: request.body.notificationId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
      });
    },
  );
  /*format create json like this
    "title": ...
    "courseId:" ...
    "UserId": [] ....
  */
  private createForum = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const forum = await prisma.forum.create({ data: request.body });

      if (!forum) throw new Error("Cannot create forum");

      response.json({
        mess: "Successfully!",
        success: true,
        data: forum,
      });
    },
  );
  /*format create json like this
    query: ... forumId
  */
  private getForum = asyncHandler(
    async (request: any, response: express.Response) => {
      const forum = await prisma.forum.findFirst({
        where: {
          id: request.query.id,
        },
        select: {
          courseId: true,
          id: true,
          title: true,
          threads: {
            select: {
              title: true,
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!forum) throw new Error("Cannot find forum");

      response.json({
        mess: "Successfully!",
        success: true,
        data: forum,
      });
    },
  );
  /*format create json like this
    "title": ...
    "forumId:" ...
  */
  private createThread = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const thread = await prisma.thread.create({ data: request.body });

      if (!thread) throw new Error("Cannot create thread");

      response.json({
        mess: "Successfully!",
        success: true,
        data: thread,
      });
    },
  );
  /* query id thread */
  private getThread = asyncHandler(
    async (request: any, response: express.Response) => {
      const thread : any = await prisma.thread.findFirst({
        where: {
          id: request.query.id,
        },
        select: {
          forumId: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          posts: {
            select: {
              sender: true,
              createdAt: true,
              updatedAt: true,
              title: true,
              replyTo: true,
              content: true,
              user : {
                select: {
                  username: true,
                  avatar: true
                }
              }
            },
          },
        },
      });
      // find user receive in each post with field replyTo
      // for (let i = 0; i < thread.posts.length; i++) {
      //   if (thread.posts[i].replyTo) {
      //     thread.posts[i].replyTo = await prisma.post.findFirst({
      //       where: {
      //         id: thread.posts[i].replyTo,
      //       },
      //       select: {
              
      //       },
      //     });
      //   }
      // }
      if (!thread) throw new Error("Cannot get thread");

      response.json({
        mess: "Successfully!",
        success: true,
        data: thread,
      });
    },
  );
  //admin tạo, hs/gv get cái object này tùy theo lựa chọn
  private createNotification = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const post = await prisma.notification.create({ data: request.body });

      if (!post) throw new Error("Cannot create notification");

      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
      });
    },
  );
  private getNotification = asyncHandler(
    async (request: any, response: express.Response) => {
      const post = await prisma.notification.findFirst({
        where: {
          id: request.query.id,
        },
        select: {
          updatedAt: true,
          posts: {
            select: {
              id: true,
              sender: true,
              createdAt: true,
              title: true,
              content: true,
            },
          },
        },
      });

      if (!post) throw new Error("Cannot get notification");

      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
      });
    },
  );
  private getAllNotification = asyncHandler(
    async (request: any, response: express.Response) => {
      const post = await prisma.notification.findMany({
        select: {
          name: true,
          updatedAt: true,
          posts: {
            select: {
              sender: true,
              createdAt: true,
              title: true,
              content: true,
            },
          },
        },
      });

      if (!post) throw new Error("Cannot get notification");

      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
      });
    },
  );
  private getBreadcrumb = asyncHandler(
    async (request: any, response: express.Response) => {
      const post = await prisma.thread.findFirst({
        where: {
          id: request.query.id,
        },
        select: {
          id: true,
          title: true,
          forum: {
            select: {
              id: true,
              title: true,
            },
          }
        },
      });

      if (!post) throw new Error("Cannot get post");

      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
      });
    },
  );
}
