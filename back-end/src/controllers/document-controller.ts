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

export default class DocumentSectionController extends BaseController {
  public path = "/document-section";
  public storage = getStorage();
  // Setting up multer as a middleware to grab photo uploads
  public upload = multer({ storage: multer.memoryStorage() });
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllDocument);
    this.router.post(`${this.path}`, this.createDocument);
    this.router.post(
      `${this.path}/upload`,
      this.upload.single("file"),
      this.uploadPdf,
    );
    this.router.delete(`${this.path}`, this.deleteDocument);
  }
  // uploadPdf.single("file"),
  private getAllDocument = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const topics = await prisma.documentSection.findMany();
      response.json({
        mess: "Get all topic successfully !",
        success: true,
        data: topics,
      });
    },
  );
  private createDocument = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const topic = await prisma.documentSection.create({
        data: request.body,
      });
      response.json({
        mess: "Get all topic successfully !",
        success: true,
        data: topic,
      });
    },
  );
  private uploadPdf = asyncHandler(async (req: any, response: any) => {
    console.log(req.file);
    if (!req.file || !req.query.id) {
      console.error("No files provided");
      throw new Error("Internal Server Error");
    }
    const path = `resources/${req.file.originalname}`;
    const storageRef = ref(this.storage, path);

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata,
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    const documentLink = await prisma.documentLink.create({
      data: {
        url: downloadURL,
        path,
        documentSectionId: req.query.id,
        title: req.body.title || req.file.originalname,
        description: req.body.description,
      },
    });
    return response.json({
      mess: "Upload file successfully !",
      data: documentLink,
      success: true,
    });
  });
  private deleteDocument = asyncHandler(
    async (request: any, response: express.Response) => {
      const idArray = request.body;
      let arr: any = [];
      for (let i = 0; i < idArray.length; i++) {
        const document = await prisma.documentSection.findFirst({
          where: {
            id: idArray[i],
          },
          select: {
            id: true,
            title: true,
            content: true,
            quiz: true,
            documentLink: true,
          },
        });
        const documentLink: any = document?.documentLink;
        for (let doc of documentLink) {
          try {
            const storageRef = ref(this.storage, doc.path);
            await deleteObject(storageRef);
          } catch (error) {
            console.log(`Failed to delete ${doc.path}: ${error}`);
          }
        }
        const deletedDocument = await prisma.documentSection.delete({
          where: {
            id: idArray[i],
          },
          select: {
            id: true,
            title: true,
            content: true,
            quiz: true,
            documentLink: true,
          },
        });
        arr.push(deletedDocument);
      }
      response.json({
        mess: "Delete document successfully !",
        success: true,
        data: arr,
      });
    },
  );
}
