import dotenv from "dotenv";
import App from "./app";
import connection from "../moongose/conn";
import CourseController from "./controllers/course-controller";
import UserController from "./controllers/user-controllers";
dotenv.config();
connection();
const port = process.env.PORT || 3000;
const app = new App([new CourseController(), new UserController()], port);

app.listen();
