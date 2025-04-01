import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import bc from "../helper/bcripts";
import jwt from "../helper/jwt";
import moment from "moment";
import sendEmail from "../helper/sendmail";
import randomstring from "randomstring";
import { verifyAccessToken, isAdmin } from "../middlewares/verifyToken";
import token from "../../moongose/model/token";
import multer from "multer";
import { isTeacher } from "../middlewares/verifyToken";
import {
  userMulter,
  userUploadMiddleware,
  deleteCloudinaryImage,
} from "../../config/cloudinary/storage";
class UserController extends BaseController {
  public path = "/user";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    const upload = multer();
    this.router.get(this.path, [verifyAccessToken, isAdmin], this.getAllUser);
    this.router.get(
      this.path + "/current",
      [verifyAccessToken],
      this.getCurrentUser,
    );
    this.router.get(
      this.path + "/student-info",
      [verifyAccessToken, isTeacher],
      this.getStudentInfo,
    );
    this.router.post(this.path, this.addUser);
    this.router.post(this.path + "/login", this.login);
    this.router.delete(this.path + "/delete-all", this.deleteAllUser);
    this.router.put(this.path + "/change-password", this.updatePassword);
    this.router.put(this.path + "/update-by-admin",[verifyAccessToken, isAdmin], this.updateUserByAdmin);
    this.router.put(
      this.path + "/update-avatar",
      [verifyAccessToken],
      userMulter.single("file"),
      userUploadMiddleware,
      this.updateAvatar,
    );
    this.router.post(this.path + "/reset-password", this.resetPassword);
    this.router.get(
      this.path + "/reset-password/:reset_code",
      this.verifyToChangePassword,
    );
    this.router.put(this.path + "/reset-password", this.changePasswordById);
    this.router.get(
      this.path + "/list-pagination",
      [verifyAccessToken],
      this.getListUserWithPagination,
    );
    this.router.get(
      this.path + "/count",
      [verifyAccessToken],
      this.getCountPagination,
    );
    this.router.get(this.path + "/list", [verifyAccessToken], this.getListUser);
    this.router.put(this.path, [verifyAccessToken], this.updateUser);
    this.router.delete(this.path, [verifyAccessToken, isAdmin], this.deleteUser);
    this.router.get(
      this.path + "/teacher-info",
      [verifyAccessToken, isAdmin],
      this.getTeacherInfo,
    );
    this.router.get(
      this.path + "/course",
      [verifyAccessToken, isAdmin],
      this.getUserByCourseId
    )
    this.router.get(
      this.path + "/not-in-course",
      [verifyAccessToken, isAdmin],
      this.getAllUserNotInCourse
    )
    // Bạn có thể thêm put, patch, delete sau.
  }
  private getUserByCourseId = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      const users = await prisma.user.findMany({
        where: {
          courseIDs: {
            has: id
          }
        },
        select: {
          id: true,
          mssv: true,
          email: true,
          role: true,
          lastname: true,
          firstname: true,
          phone: true
        }
      })
      const course = await prisma.course.findFirst({
        where: {
          id
        },
        select: {
          title: true,
          course_id: true,
          semesterId: true,
          semester: {
            select: {
              description: true
            }
          }
        }
      })
      response.json({
        success: true,
        mess: "Get all user in course successfully !",
        data: {
          users,
          course
        }
      });
    },
  );
  private updateUser = asyncHandler(
    async (request: any, response: express.Response) => {
      const { _id } = request.user;
      const updatedUser = await prisma.user.update({
        where: {
          id: _id,
        },
        data: request.body,
      });
      response.json({
        success: true,
        mess: "Update user successfully !",
        data: updatedUser,
      });
    },
  );
  private updateAvatar = asyncHandler(
    async (request: any, response: express.Response) => {
      const cloudinaryUrl = request.body.image;
      const publicId = request.body.public_id;
      const { _id } = request.user;
      const deletedImage = await prisma.user.findUnique({
        where: {
          id: _id,
        },
      });
      if (deletedImage)
        if (deletedImage.avatar)
          await deleteCloudinaryImage(deletedImage?.public_id);
      const user = await prisma.user.update({
        where: {
          id: _id,
        },
        data: {
          avatar: cloudinaryUrl,
          public_id: publicId,
        },
      });
      if (!user || !cloudinaryUrl)
        throw new Error("Cannot update user's avatar !");
      response.json({
        success: true,
        mess: "Update avatar successfully !",
        data: user,
      });
    },
  );
  private getAllUser = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const student = await prisma.user.findMany({
        where: {
          role: "STUDENT",
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          role: true,
          email: true,
          avatar: true,
          gender: true,
          phone: true,
          mssv: true,
          date_of_birth: true,
        },
      });
      const teacher = await prisma.user.findMany({
        where: {
          role: "TEACHER",
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          role: true,
          email: true,
          avatar: true,
          gender: true,
          phone: true,
          date_of_birth: true,
        },
      });
      const admin = await prisma.user.findMany({
        where: {
          role: "ADMIN",
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          role: true,
          email: true,
          avatar: true,
          gender: true,
          phone: true,
          date_of_birth: true,
        },
      });
      response.json({
        mess: "Get all users successfully !",
        success: true,
        data: {
          student,
          teacher,
          admin,
        },
      });
    },
  );
  private addUser = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const requestData = request.body;
      // console.log(requestData);
      const arr = [];
      // Mã hóa mật khẩu cho từng người dùng trước khi thêm vào cơ sở dữ liệu
      for (const user of requestData) {
        // const {avatar} = user
        // arr.push(avatar)
        const hmacDigest = randomstring.generate({
          length: 6,
          charset: "numeric",
        });
        const time = moment().format("MMMM Do YYYY h:mm:ss a");
        const { email, password, lastname, firstname } = user;
        if (!email || !password)
          response.status(402).json({
            success: false,
            mess: "Missing inputs !",
          });
        user.password = await bc.hash(user.password.toString());
        user.username = (firstname[0] + "." + lastname).toLowerCase();
        user.updatedAt = time;
        user.createdAt = time;
        user.mssv = `SV${hmacDigest}`
      }
      // Thêm người dùng đã mã hóa vào cơ sở dữ liệu
      const createdUsers = await prisma.user.createMany({
        data: requestData,
      });
      
      response.json({
        success: true,
        mess: "Created new user successfully !",
        data: createdUsers,
      });
    },
  );
  private login = asyncHandler(
    async (request: express.Request, response: any) => {
      const { email, password } = request.body;
      const foundUser: any = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!foundUser) throw new Error("Email doesn't exist");
      if (await bc.compare(password, foundUser?.password)) {
        const token = await jwt.generateAccessToken(
          foundUser?.id,
          foundUser?.role,
        );
        response.cookie("access_token", token, {
          expires: new Date(Date.now() + 60 * 60),
          httpOnly: false,
        });
        response.json({
          success: true,
          mess: "Login successfully !",
          access_token: token,
        });
      } else throw new Error("Password is wrong");
    },
  );
  private getCurrentUser = asyncHandler(
    async (request: any, response: express.Response) => {
      const user = await prisma.user.findUnique({
        where: {
          id: request.user._id,
        },
      });
      response.json({
        success: true,
        mess: "Got current user !",
        data: user,
      });
    },
  );
  private deleteAllUser = asyncHandler(
    async (req, response: express.Response) => {
      const deletedUser = await prisma.user.deleteMany();
      response.json({
        mess: "Deleted all user !",
        data: deletedUser,
      });
    },
  );
  private updatePassword = asyncHandler(
    async (req: any, response: express.Response) => {
      const { username, email, old_password, new_password } = req.body;
      const foundUser = await prisma.user.findFirst({
        where: {
          username,
          email,
        },
      });
      if (!foundUser) throw new Error("Account doesn't exist !");
      const checkPass = await bc.compare(old_password, foundUser?.password);
      if (!checkPass) throw new Error("Password is wrong !");
      const time = moment().format("MMMM Do YYYY h:mm:ss a");
      const hashPass = await bc.hash(new_password.toString());
      const updatedUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashPass,
          updatedAt: time,
        },
      });
      response.json({
        success: true,
        mess: "Updated user's password !",
        data: updatedUser,
      });
    },
  );
  private resetPassword = asyncHandler(
    async (req: any, response: express.Response) => {
      const { email, username } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          email,
          username,
        },
      });
      if (!user) throw new Error("Account doesn't exist !");
      const hmacDigest = randomstring.generate({
        length: 6,
        charset: "numeric",
      });
      let Token = await token.findOne({
        userId: user?.id,
      });
      if (!Token) {
        const link = `${hmacDigest}`;
        await sendEmail(email, "Password reset ", link);
        Token = await new token({
          userId: user?.id,
          token: hmacDigest,
        }).save();
      } else
        response.json({
          success: true,
          mess: "Sent mail to you, code still doesn't expire, use it right now !",
        });
      // >> "xqm5wXX"
      response.json({
        success: true,
        mess: "Send mail successfully !",
        data: token,
      });
    },
  );
  private verifyToChangePassword = asyncHandler(async (req: any, res: any) => {
    const { reset_code } = req.params;
    const rs = await token.findOne({
      token: reset_code,
    });
    if (!rs) throw new Error("Expired to reset !");
    res.json({
      success: true,
      mess: "Go to update password right now !",
      data: rs?.userId,
    });
  });
  private changePasswordById = asyncHandler(async (req: any, res: any) => {
    const { id, password } = req.body;
    let rs = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!rs) throw new Error("No one to update !");
    const time = moment().format("MMMM Do YYYY h:mm:ss a");
    const hashPass = await bc.hash(password.toString());
    rs = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashPass,
        updatedAt: time,
      },
    });
    res.json({
      success: true,
      mess: "Update password successfully !",
      data: rs,
    });
  });
  private getListUserWithPagination = asyncHandler(
    async (request: any, response: express.Response) => {
      const { role } = request.user;
      let list;
      const TAKE = Number(process.env.SKIP);
      const SKIP = TAKE * (request.query.page - 1);
      if (role === "ADMIN") {
        list = await prisma.user.findMany({
          skip: SKIP,
          take: TAKE,
          where: {
            courseIDs: { has: request.query.id },
          },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            role: true,
            email: true,
            phone: true,
          },
        });
      } else if (role === "STUDENT")
        throw new Error("You don't have permission to get list user !");
      else
        list = await prisma.user.findMany({
          skip: SKIP,
          take: TAKE,
          where: {
            courseIDs: { has: request.query.id },
            role: "STUDENT",
          },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            role: true,
            email: true,
            phone: true,
            gender: true,
          },
        });

      response.json({
        mess: "Get users successfully !",
        success: true,
        data: list,
      });
    },
  );
  private getCountPagination = asyncHandler(
    async (request: any, response: express.Response) => {
      const { role } = request.user;
      let count;
      if (role === "ADMIN") {
        count = await prisma.user.count({
          where: {
            courseIDs: { has: request.query.id },
          },
        });
      } else if (role === "STUDENT")
        throw new Error("You don't have permission to get list user !");
      else
        count = await prisma.user.count({
          where: {
            role: "STUDENT",
            courseIDs: { has: request.query.id },
          },
        });
      // lấy data = count / skip , làm tròn lên
      response.json({
        mess: "Get users successfully !",
        success: true,
        data: Math.ceil(count / Number(process.env.SKIP)),
      });
    },
  );
  private getListUser = asyncHandler(
    async (request: any, response: express.Response) => {
      const { role } = request.user;
      let list : any = null;
      if (role === "ADMIN") {
        list = await prisma.user.findMany({
          where: {
            courseIDs: { has: request.query.id },
          },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            role: true,
            email: true,
            phone: true,
            date_of_birth: true,
          },
        });
      } else if (role === "STUDENT")
        throw new Error("You don't have permission to get list user !");
      else {
        list = await prisma.user.findMany({
          where: {
            courseIDs: { has: request.query.id },
            role: "STUDENT",
          },
          select: {
            id: true,
            mssv: true,
            firstname: true,
            lastname: true,
            role: true,
            email: true,
            phone: true,
            gender: true,
            date_of_birth: true,
          },
        });
        for (const user of list) {
          const course = await prisma.courseResult.findFirst({
            where: {
              userId: user.id,
              courseId: request.query.id,
            },
            select: {
              score_array: true,
              average_score: true,
            },
          });
          user.result = course;
        }
      }
      response.json({
        mess: "Get users successfully !",
        success: true,
        data: list,
      });
    },
  );
  private getStudentInfo = asyncHandler(
    async (request: any, response: express.Response) => {},
  );
  private deleteUser = asyncHandler(
    async (request: any, response: express.Response) => {
      let arr = []
      for (const id of request.body) {
        const deletedUser = await prisma.user.delete({
          where: {
            id,
          },
        });
        const foundCourse = await prisma.course.findMany({
          where: {
            usersId: {
              has: deletedUser.id
            }
          }
        })
        for (let i = 0; i < foundCourse?.length; i++) {
          foundCourse[i].usersId = foundCourse[i].usersId.filter((el) => el != deletedUser.id)
          await prisma.course.update({
            where: {
              id: foundCourse[i].id
            },
            data: {
              usersId: foundCourse[i].usersId
            }
          })
        }
        arr.push(deletedUser)
      }
      response.json({
        success: true,
        mess: "Deleted user successfully !",
        data: arr,
      });
    },
  );
  private updateUserByAdmin = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.body;
      delete request.body.id;
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: request.body,
      });
      response.json({
        success: true,
        mess: "Updated user successfully !",
        data: updatedUser,
      });
    },
  );
  private getTeacherInfo = asyncHandler(
    async (request: any, response: express.Response) => {
      const teacher = await prisma.user.findMany({
        where: {
          role: "TEACHER",
        },
      });
      response.json({
        success: true,
        mess: "Get teacher info successfully !",
        data: teacher,
      });
    },
  );
  private getAllUserNotInCourse = asyncHandler(
    async (request: any, response: express.Response) => {
      const {id} = request.query
      const user = await prisma.user.findMany({
        where: {
          NOT: {
            role: "ADMIN",
            courseIDs: {
              has: id
            }
          },
        },
      });
      response.json({
        success: true,
        mess: "Get all user out of course successfully !",
        data: user,
      });
    },
  );
}
export default UserController;
