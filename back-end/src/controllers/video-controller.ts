import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import urlMetadata from "metadata-scraper";

class VideoController extends BaseController {
  public path = "/video-section";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/add-video`, this.createVideo);
    this.router.delete(`${this.path}/delete-video`, this.deleteVideo);
    // Bạn có thể thêm put, patch, delete sau.
    this.router.post(this.path, this.createVideoSection);
    this.router.delete(this.path, this.deleteVideoSection);
    this.router.put(this.path, this.updateVideoSection);
  }
  private createVideo = asyncHandler(
    async (request: any, response: express.Response) => {
      if (!request.body.video_link) throw new Error("Url is required");
      if (!request.body.videoSectionId)
        throw new Error("VideoSectionId is required");
      const { video_link } = request.body;
      const metadata = await urlMetadata(video_link);
      const { title, description, image, url, provider, icon } = metadata;
      const video = await prisma.video.create({
        data: {
          title,
          description,
          thumbnail: image || icon,
          url,
          provider,
          videoSectionId: request.body.videoSectionId,
        },
      });
      response.json({
        mess: "Created new video",
        data: video,
        success: true,
      });
    },
  );
  private createVideoSection = asyncHandler(
    async (request: any, response: express.Response) => {
      const { description, title, courseId } = request.body;
      if (!title || !courseId) throw new Error("Missing fields");
      const videoSection = await prisma.videoSection.create({
        data: {
          title,
          description,
          courseId,
        },
      });
      if (!videoSection) throw new Error("Failed to create video section");
      response.json({
        mess: "Created new video section",
        data: videoSection,
        success: true,
      });
    },
  );
  private deleteVideoSection = asyncHandler(
    async (request: any, response: express.Response) => {
      const idArray = request.body;
      if (!idArray) throw new Error("Id array is required");
      for (let i = 0; i < idArray.length; i++) {
        const videoSection = await prisma.videoSection.findUnique({
          where: { id: idArray[i] },
        });

        if (!videoSection) {
          console.log(`VideoSection with id ${idArray[i]} does not exist`);
          continue;
        }

        await prisma.videoSection.delete({
          where: { id: idArray[i] },
        });
      }
      response.json({
        mess: "Deleted video section",
        success: true,
      });
    },
  );
  private deleteVideo = asyncHandler(
    async (request: any, response: express.Response) => {
      const idArray = request.body;
      if (!idArray) throw new Error("Id array is required");
      let arr = [];
      for (let i = 0; i < idArray.length; i++) {
        const video = await prisma.video.findUnique({
          where: { id: idArray[i] },
        });

        if (!video) {
          console.log(`Video with id ${idArray[i]} does not exist`);
          continue;
        }

        const rs = await prisma.video.delete({
          where: { id: idArray[i] },
        });
        arr.push(rs);
      }
      response.json({
        mess: "Deleted video successfully",
        success: true,
        data: arr,
      });
    },
  );
  private updateVideoSection = asyncHandler(
    async (request: any, response: express.Response) => {
      const video = await prisma.videoSection.update({
        where: { id: request.query.id },
        data: request.body,
      });
      response.json({
        mess: "Updated video",
        data: video,
        success: true,
      });
    },
  );
}
export default VideoController;
