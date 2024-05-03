import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { verify } from "crypto";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

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
    this.router.post(
      `${this.path}/notification`,
      [verifyAccessToken, isAdmin],
      this.createNotification,
    );
    this.router.get(`${this.path}/notification`, this.getNotification);
    this.router.get(`${this.path}/forum/thread/breadcrumb`, this.getBreadcrumb);
    this.router.delete(`${this.path}`, [verifyAccessToken], this.deletePost);
    this.router.delete(
      `${this.path}/notification`,
      [verifyAccessToken, isAdmin],
      this.deleteNotification,
    );
    this.router.put(`${this.path}`, [verifyAccessToken], this.updatePost);
    this.router.get(`${this.path}/forum/course`, this.getForumByCourse);
    this.router.delete(
      `${this.path}/forum`,
      [verifyAccessToken],
      this.deleteForum,
    );
    this.router.delete(`${this.path}/forum/thread`, this.deleteThread);
    this.router.delete(`${this.path}/single`, this.deleteSinglePost);
  }
  /*format create json like the model
   */
  private createPost = asyncHandler(
    async (request: any, response: express.Response) => {
      const user: any = await prisma.user.findFirst({
        where: {
          id: request.user._id,
        },
        select: {
          lastname: true,
          firstname: true,
        },
      });
      request.body.sender =
        request.body.sender || user.firstname + " " + user.lastname;
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
        mess: "Create new post successfully!",
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
  private deleteForum = asyncHandler(
    async (request: any, response: express.Response) => {
      for (const id of request.body) {
        await prisma.forum.delete({
          where: { id },
        });
      }
      response.json({
        mess: "Delete forum successfully!",
        success: true,
        data: null,
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
  private getForumByCourse = asyncHandler(
    async (request: any, response: express.Response) => {
      const forum: any = await prisma.forum.findMany({
        where: {
          courseId: request.query.id,
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
      console.log(forum);
      // const latestPost : any = await prisma.post.findFirst({
      //   where: {
      //     thread: {
      //       forum : {
      //         courseId: request.query.id
      //       }
      //     }
      //   },
      //   orderBy: {
      //     createdAt: 'desc',
      //   },
      //   select: {
      //     user : {
      //       select: {
      //         username: true,
      //         avatar: true,
      //         createdAt: true
      //       },
      //     },
      //     updatedAt: true
      //   }
      // });
      // console.log(latestPost);
      // forum.lastest_user = latestPost.user;

      // find user for lastest post in each thread
      for (let i = 0; i < forum.length; i++) {
        for (let j = 0; j < forum[i]?.threads?.length; j++) {
          const latestPost: any = await prisma.post.findFirst({
            where: {
              threadId: forum[i]?.threads[j].id,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              user: {
                select: {
                  username: true,
                  avatar: true,
                  createdAt: true,
                },
              },
              updatedAt: true,
            },
          });
          console.log(latestPost);
          forum[i].threads[j].lastest_user = latestPost?.user;
          forum[i].threads[j].last_updated_at = latestPost?.updatedAt; // Add this line
        }
      }

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
  private deleteThread = asyncHandler(
    async (request: any, response: express.Response) => {
      console.log(request.body);
      for (const id of request.body) {
        await prisma.thread.delete({
          where: { id },
        });
      }
      response.json({
        mess: "Delete thread successfully!",
        success: true,
        data: null,
      });
    },
  );
  /* query id thread */
  private getThread = asyncHandler(
    async (request: any, response: express.Response) => {
      const thread: any = await prisma.thread.findFirst({
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
              id: true,
              sender: true,
              createdAt: true,
              updatedAt: true,
              title: true,
              replyTo: true,
              content: true,
              user: {
                select: {
                  id: true,
                  role: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      const course = await prisma.course.findFirst({
        where: {
          forum: {
            some: {
              id: thread?.forumId,
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });
      thread.courseId = course?.id;
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
  private deleteNotification = asyncHandler(
    async (request: any, response: express.Response) => {
      for (const id of request.body) {
        await prisma.notification.delete({
          where: { id },
        });
      }
      response.json({
        mess: "Delete notification successfully!",
        success: true,
        data: null,
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
          id: true,
          updatedAt: true,
          posts: {
            select: {
              id: true,
              sender: true,
              createdAt: true,
              title: true,
              content: true,
              receiver: true,
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
          id: true,
          name: true,
          updatedAt: true,
          posts: {
            select: {
              id: true,
              sender: true,
              createdAt: true,
              title: true,
              content: true,
              receiver: true,
              updatedAt: true,
            },
          },
        },
      });
      const totalPost = await prisma.post.count();
      if (!post) throw new Error("Cannot get notification");

      response.json({
        mess: "Successfully!",
        success: true,
        data: post,
        totalPost,
      });
    },
  );
  private getBreadcrumb = asyncHandler(
    async (request: any, response: express.Response) => {
      let arr: any = [];
      let post: any = await prisma.thread.findFirst({
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
              course : {
                select: {
                  id: true,
                  title: true
                }
              }
            },
          },
        },
      });
      if (post) {
        arr.push({
          id: post?.forum?.course?.id,
          title: post?.forum?.course?.title,
        });
        arr.push({
          id: post?.forum?.id,
          title: post?.forum?.title,
        });
        arr.push({
          id: post?.id,
          title: post?.title,
        });
      } else {
        const forum = await prisma.forum.findFirst({
          where: {
            id: request?.query?.id,
          },
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          },
        });
        if (forum) {
          arr.push({
            id: forum?.course.id,
            title: forum?.course?.title,
          });
          arr.push({
            id: forum?.id,
            title: forum?.title,
          });
        }
      }

      response.json({
        mess: "Successfully!",
        success: true,
        data: arr,
      });
    },
  );
  private deletePost = asyncHandler(
    async (request: any, response: express.Response) => {
      console.log(request.body);
      const { nid, pid } = request.body;
      if (!nid || !pid) throw new Error("Id array is required");
      for (let i = 0; i < pid.length; i++) {
        await prisma.post.delete({
          where: { id: pid[i] },
        });
      }
      await prisma.notification.update({
        where: { id: nid },
        data: {
          updatedAt: new Date(),
        },
      });

      response.json({
        mess: "Delete posts successfully!",
        success: true,
        data: null,
      });
    },
  );
  private updatePost = asyncHandler(
    async (request: any, response: express.Response) => {
      console.log(request.body);
      request.body.updatedAt = new Date();
      const post = await prisma.post.update({
        where: { id: request.query.id },
        data: request.body,
        select: {
          id: true,
          title: true,
          content: true,
          sender: true,
          createdAt: true,
          notificationId: true,
          threadId: true,
        },
      });
      if (post?.notificationId)
        await prisma.notification.update({
          where: { id: post.notificationId || "" },
          data: {
            updatedAt: new Date(),
          },
        });
      if (post?.threadId)
        await prisma.thread.update({
          where: { id: post.threadId || "" },
          data: {
            updatedAt: new Date(),
          },
        });
      response.json({
        mess: "Update post successfully!",
        success: true,
        data: post,
      });
    },
  );
  private deleteSinglePost = asyncHandler(
    async (request: any, response: express.Response) => {
      // console.log(request.body);
      const post = await prisma.post.delete({
        where: { id: request.query.id },
      });
      if (post?.notificationId)
        await prisma.notification.update({
          where: { id: post.notificationId || "" },
          data: {
            updatedAt: new Date(),
          },
        });
      if (post?.threadId)
        await prisma.thread.update({
          where: { id: post.threadId || "" },
          data: {
            updatedAt: new Date(),
          },
        });
      response.json({
        mess: "Delete post successfully!",
        success: true,
        data: post,
      });
    },
  );
}
