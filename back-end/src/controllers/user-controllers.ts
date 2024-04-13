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
import { userMulter, userUploadMiddleware, deleteCloudinaryImage } from "../../config/cloudinary/storage";
class UserController extends BaseController {
  public path = "/user";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    const upload = multer()
    this.router.get(this.path, [verifyAccessToken, isAdmin], this.getAllUser);
    this.router.get(
      this.path + "/current",
      [verifyAccessToken],
      this.getCurrentUser,
    );
    this.router.post(this.path, this.addUser);
    this.router.post(this.path + "/login", this.login);
    this.router.post(this.path + "/logout", this.logout);
    this.router.delete(this.path + "/delete-all", this.deleteAllUser);
    this.router.put(this.path + "/change-password", this.updatePassword);
    this.router.put(this.path + "/update-avatar", [verifyAccessToken],userMulter.single('file'), userUploadMiddleware, this.updateAvatar);
    this.router.post(this.path + "/reset-password", this.resetPassword);
    this.router.get(
      this.path + "/reset-password/:reset_code",
      this.verifyToChangePassword,
    );
    this.router.put(this.path + "/reset-password", this.changePasswordById);
    // Bạn có thể thêm put, patch, delete sau.
  }
  private updateAvatar = asyncHandler(async(request: any, response: express.Response) => {
    const cloudinaryUrl = request.body.image;
    const publicId = request.body.public_id
    const {_id} = request.user
    const deletedImage = await prisma.user.findUnique({
      where:{
        id: _id
      }
    })
    if(deletedImage)
      await deleteCloudinaryImage(deletedImage?.public_id)
    const user = await prisma.user.update({
      where:{
        id: _id
      },
      data:{
        avatar: cloudinaryUrl,
        public_id: publicId
      }
    })
    if (!user || !cloudinaryUrl) throw new Error("Cannot update user's avatar !")
    response.json({
      success: true,
      mess: "Update avatar successfully !",
      data: user
    })
  })
  private getAllUser = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const courses = await prisma.user.findMany({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          role: true,
          email: true,
        },
      });
      response.json({
        mess: "Get all users successfully !",
        success: true,
        data: courses,
      });
    },
  );
  private addUser = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      const requestData = request.body;
      const arr = []
      // Mã hóa mật khẩu cho từng người dùng trước khi thêm vào cơ sở dữ liệu
      for (const user of requestData) {
        // const {avatar} = user
        // arr.push(avatar)
        const time = moment().format("MMMM Do YYYY h:mm:ss a");
        const { email, password, lastname, firstname } = user;
        if (!email || !password)
        response.status(402).json({
          success: false,
          mess: "Missing inputs !"
        });;
        user.password = await bc.hash(user.password.toString());
        user.username = (firstname[0] + "." + lastname).toLowerCase();
        user.updatedAt = time;
        user.createdAt = time;
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
      if (await bc.comprare(password, foundUser?.password)) {
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
  private logout = asyncHandler(
    async (request: express.Request, response: express.Response) => {
      // jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
      //   console.log(token);
      // });
      // const { role, uid } = request.body;
      // // console.log(role);
      // const token = jwt.generateAccessToken("USER", "ưddw");
      const token = moment().format("MMMM Do YYYY h:mm:ss a");
      response.json({
        success: true,
        mess: "Login successfully !",
        accessToken: token,
      });
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
      const checkPass = await bc.comprare(old_password, foundUser?.password);
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
        charset: 'numeric'
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
      }
      else response.json({
        success: true,
        mess: "Sent mail to you, code still doesn't expire, use it right now !"
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
        id
      }
    })
    if (!rs) throw new Error("No one to update !");
    const time = moment().format("MMMM Do YYYY h:mm:ss a");
    const hashPass = await bc.hash(password.toString());
    rs = await prisma.user.update({
      where: {
        id
      },
      data: {
        password: hashPass,
        updatedAt: time
      }
    })
    res.json({
      success: true,
      mess: "Update password successfully !",
      data: rs
    });
  });
}
export default UserController;
