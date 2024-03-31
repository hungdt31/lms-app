import dotenv from "dotenv";
import multer, { Multer } from "multer";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import sharp from "sharp";
import express from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

class CloudinaryUploader {
  private multer: Multer;
  private destination: string;
  constructor(desc : string) {
    this.destination = desc
    const storage = multer.memoryStorage();
    this.multer = multer({ storage: storage });

    this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
  }

  public getMulterInstance(): Multer {
    return this.multer;
  }
  public async deleteFromCloudinary(public_id: any): Promise<void> {
    try {
      await cloudinary.uploader.destroy(public_id);
      console.log('Deleted image !')
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw error;
    }
  }
  public async uploadToCloudinary(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const file: CloudinaryFile = req.file as CloudinaryFile;
      if (!file) {
        return next(new Error("No files provided"));
      }

      const resizedBuffer: Buffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600 })
        .toBuffer();

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: this.destination, // Sử dụng tham số của constructor cho đường dẫn folder
        } as any,
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return next(err);
          }
          if (!result) {
            console.error("Cloudinary upload error: Result is undefined");
            return next(new Error("Cloudinary upload result is undefined"));
          }
          const url: string = result.secure_url;
          const public_id : string = result.public_id
          if (url.length !== 0) {
            req.body.image = url
            req.body.public_id = public_id
            next();
          }
        },
      );
      uploadStream.end(resizedBuffer);
    } catch (error) {
      console.error("Error in uploadToCloudinary middleware:", error);
      next(error);
    }
  }
}

// Sử dụng lớp CloudinaryUploader để xử lý hai loại folder khác nhau
const courseUploader = new CloudinaryUploader("lms-app/courses");
export const courseUploadMiddleware = courseUploader.uploadToCloudinary;
export const deleteCloudinaryImage = courseUploader.deleteFromCloudinary;
export const courseMulter = courseUploader.getMulterInstance();

const userUploader = new CloudinaryUploader("lms-app/users");
export const userUploadMiddleware = userUploader.uploadToCloudinary;
export const userMulter = userUploader.getMulterInstance();
