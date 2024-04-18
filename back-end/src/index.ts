import dotenv from "dotenv";
import App from "./app";
import config from "../config/firebase";
import { initializeApp } from "firebase/app";
import connection from "../moongose/conn";
import CourseController from "./controllers/course-controller";
import UserController from "./controllers/user-controllers";
import CategoryController from "./controllers/category-controller";
import SemesterController from "./controllers/semester-controller";
import DocumentSectionController from "./controllers/document-controller";
import DocumentLinkController from "./controllers/documentLink-controller";
import QuizController from "./controllers/quiz-controller";
import VideoController from "./controllers/video-controller";
import GradeController from "./controllers/grade-controller";
dotenv.config();
initializeApp(config.firebaseConfig);
connection();

const port = process.env.PORT || 3000;
const app = new App(
  [
    new UserController(),
    new CourseController(),
    new CategoryController(),
    new SemesterController(),
    new DocumentSectionController(),
    new DocumentLinkController(),
    new QuizController(),
    new VideoController(),
    new GradeController()
  ],
  port,
);

app.listen();