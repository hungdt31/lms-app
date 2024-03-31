import jwt from "jsonwebtoken";
const primaryKey: any = process.env.JWT_SECRET;
const generateAccessToken = (uid: any, role: any) =>
  jwt.sign({ _id: uid, role }, primaryKey, { expiresIn: "1h" });
const generateRefreshToken = (uid: string) =>
  jwt.sign({ _id: uid }, primaryKey, { expiresIn: "7d" });
export default {
  generateAccessToken,
  generateRefreshToken,
};
