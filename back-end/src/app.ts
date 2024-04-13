import express from "express";
import { BaseController } from "./controllers/abstractions/base-controller";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import YAML from "yaml"
import path from "path";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import multer from "multer";
class App {
  public app: express.Application;
  public port: number | string;

  constructor(controllers: BaseController[], port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: process.env.FRONT_END_URL,
      }),
    );
    const upload = multer() 
    this.app.use(express.static('public'));
  }

  private initializeErrorHandling() {
    errorHandler.forEach((error_function) => {
      this.app.use(error_function);
    });
  }

  private initializeControllers(controllers: BaseController[]) {
    this.app.get("/", (request, response) => {
      response.send("Application is running");
    });
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
    const file = fs.readFileSync(path.resolve('lms-swagger.yaml'),'utf8');
    const swaggerDocument = YAML.parse(file);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port http://localhost:${this.port}`);
    });
  }
}

export default App;
