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

export default class DocumentLinkController extends BaseController {
  public path = "/document-link";
  public storage = getStorage();
  // Setting up multer as a middleware to grab photo uploads
  public upload = multer({ storage: multer.memoryStorage() });
  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.delete(`${this.path}`, this.deleteDocument);
  }
  private deleteDocument = asyncHandler(
    async (request: any, response: express.Response) => {
      const idArray = request.body;
      for (let i = 0; i < idArray.length; i++) {
        const documentLink = await prisma.documentLink.delete({
          where: {
            id: idArray[i],
          },
        });
        const path: any = documentLink?.path;
        try {
          const storageRef = ref(this.storage, path);
          await deleteObject(storageRef);
        } catch (error) {
          throw new Error(`Failed to delete ${path}: ${error}`);
        }
      }
      response.json({
        mess: "Delete document successfully !",
        success: true,
        data: null,
      });
    },
  );
}
