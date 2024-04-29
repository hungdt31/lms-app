import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import multer from "multer";
import { verifyAccessToken } from "../middlewares/verifyToken";

export default class SubmissionController extends BaseController {
  public path = "/submission";
  public storage = getStorage();
  // Setting up multer as a middleware to grab photo uploads
  public upload = multer({ storage: multer.memoryStorage() });
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      this.upload.array("files", 5),
      this.createSubmission,
    );
    this.router.post(
      this.path + "/result",
      this.upload.any(),
      [verifyAccessToken],
      this.createSubmissionResult,
    );
    this.router.get(this.path, this.getSubmission);
    this.router.get(this.path + "/all-result", this.getAllSubmissionResult);
    this.router.get(this.path + "/result", this.getSubmissionResult);
    this.router.get(
      this.path + "/result/token",
      [verifyAccessToken],
      this.getUserSubmissionByToken,
    );
    this.router.put(this.path + "/result", this.updateSubmissionResult);
    this.router.put(
      this.path + "/result/user",
      this.upload.array("files", 5),
      this.updateSubmissionResultByUser,
    );
  }
  private updateSubmissionResultByUser = asyncHandler(
    async (req: any, response: any) => {
      const { id, deleteList, deleteId } = req.body;
      // console.log(deleteList)
      console.log(req.body)
      const files = req.files;
      const foundSubmissionResult = await prisma.userSubmission.findFirst({
        where: {
          id,
        },
        include: {
          files: true,
        },
      });
      if (!foundSubmissionResult)
        throw new Error("Submission result not found!");
      if (typeof deleteList === 'string') {
        const path: any = deleteList;
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
        await prisma.userFile.delete({
          where: {
            id: deleteId,
          },
        });
      } else {
      for (let i = 0; i < deleteList?.length; i++) {
        const path: any = deleteList[i];
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
        await prisma.userFile.delete({
          where: {
            id: deleteId[i],
          },
        });
      }
    }
      for (let i = 0; i < files?.length; i++) {
        const path = `resources/user-submission/${files[i].originalname}`;
        const storageRef = ref(this.storage, path);
        const metadata = {
          contentType: files[i].mimetype,
        };
        const snapshot = await uploadBytesResumable(
          storageRef,
          files[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        const submissionFile = await prisma.userFile.create({
          data: {
            url: downloadURL,
            path,
            userSubmissionId: foundSubmissionResult.id,
            title: files[i].originalname,
          },
        });
      }
      await prisma.userSubmission.update({
        where: {
          id,
        },
        data: {
          updatedAt: new Date(),
        },
      });
      response.json({
        data: foundSubmissionResult,
        success: true,
        mess: "Update submission result successfully!",
      });
    },
  );
  private getUserSubmissionByToken = asyncHandler(
    async (req: any, response: any) => {
      const submission = await prisma.userSubmission.findFirst({
        where: {
          userId: req.user._id,
          submissionId: req.query.id,
        },
        include: {
          files: true,
        },
      });
      response.json({
        data: submission,
        success: true,
        mess: "Get submission successfully!",
      });
    },
  );
  private updateSubmissionResult = asyncHandler(
    async (req: express.Request, response: any) => {
      const { id, score } = req.body;
      let submissionResult;
      const foundSubmissionResult = await prisma.userSubmission.findFirst({
        where: {
          id,
        },
      });
      if (!foundSubmissionResult?.isChecked)
        submissionResult = await prisma.userSubmission.update({
          where: {
            id,
          },
          data: {
            score,
            isChecked: true,
            beGraded: new Date(),
          },
        });
      else {
        submissionResult = await prisma.userSubmission.update({
          where: {
            id,
          },
          data: {
            score,
            editGradeAt: new Date(),
          },
        });
      }
      response.json({
        data: submissionResult,
        success: true,
        mess: "Update submission result successfully!",
      });
    },
  );
  private getSubmissionResult = asyncHandler(
    async (req: any, response: any) => {
      const submissionResult = await prisma.userSubmission.findFirst({
        where: {
          userId: req.query.userId,
          submissionId: req.query.submissionId,
        },
        select: {
          id: true,
          score: true,
          isChecked: true,
          createdAt: true,
          updatedAt: true,
          files: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
              email: true,
              avatar: true,
            },
          },
          beGraded: true,
          editGradeAt: true,
        },
      });
      response.json({
        data: submissionResult,
        success: true,
        mess: "Get submission result successfully!",
      });
    },
  );
  private getAllSubmissionResult = asyncHandler(
    async (req: any, response: any) => {
      const submissionResult = await prisma.userSubmission.findMany({
        where: {
          submission: {
            documentSection: {
              courseId: req.query.courseId,
            },
          },
          userId: req.query.userId,
        },
        select: {
          id: true,
          submission: {
            select: {
              id: true,
              title: true,
              end_date: true,
            },
          },
          score: true,
          isChecked: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      response.json({
        data: submissionResult,
        success: true,
        mess: "Get submission result successfully!",
      });
    },
  );
  private createSubmissionResult = asyncHandler(
    async (req: any, response: any) => {
      const files = req.files;
      const submissionResult = await prisma.userSubmission.create({
        data: {
          submissionId: req.body.id,
          userId: req.user._id ,
        },
      });
      for (let i = 0; i < files.length; i++) {
        const path = `resources/user-submission/${files[i].originalname}`;
        const storageRef = ref(this.storage, path);
        const metadata = {
          contentType: files[i].mimetype,
        };
        const snapshot = await uploadBytesResumable(
          storageRef,
          files[i].buffer,
          metadata,
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        const submissionFile = await prisma.userFile.create({
          data: {
            url: downloadURL,
            path,
            userSubmissionId: submissionResult.id,
            title: files[i].originalname,
          },
        });
      }
      response.json({
        mess: "Create new submission result successfully !",
        data: submissionResult,
        success: true,
      });
    },
  );
  private createSubmission = asyncHandler(async (req: any, response: any) => {
    // tách trường file ra khỏi req.body
    // const k = req.body.files;
    //console.log(req.files);
    if (!req.files) {
      console.error("No files provided");
      throw new Error("Internal Server Error");
    }
    const submission = await prisma.submission.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        documentSectionId: req.body.documentSectionId,
      },
    });
    for (let i = 0; i < req.files?.length; i++) {
      const path = `resources/submission/${req.files[i].originalname}`;
      const storageRef = ref(this.storage, path);

      // Create file metadata including the content type
      const metadata = {
        contentType: req.files[i].mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.files[i].buffer,
        metadata,
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);
      const submissionFile = await prisma.submissionFile.create({
        data: {
          url: downloadURL,
          path,
          submissionId: submission.id,
          title: req.files[i].originalname,
        },
      });
    }
    const TotalSubmission = await prisma.submission.findFirst({
      where: {
        id: submission.id,
      },
      select: {
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        files: true,
      },
    });
    response.json({
      mess: "Create new submission for student successfully !",
      data: TotalSubmission,
      success: true,
    });
  });
  private getSubmission = asyncHandler(async (req: any, response: any) => {
    const id = req.query.id;
    const submission = await prisma.submission.findFirst({
      where: {
        id,
      },
      select: {
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        files: true,
      },
    });
    response.json({
      data: submission,
      success: true,
      mess: "Get submission successfully!",
    });
  });
}
