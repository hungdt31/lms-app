import bcrypt from "bcryptjs";
const hash = async (plainTextPassword: string): Promise<string> => {
  const num: any = process.env.SALT;
  const salt = (await bcrypt.genSalt(num)).toString();
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
  // console.log("Hashed Password: ", hashedPassword);
  console.log("Hased Password successfully")
  return hashedPassword;
};
const compare = async (plainTextPassword: any, hashedPassword: any) => {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
};
export default { hash, compare };
