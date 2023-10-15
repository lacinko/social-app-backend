require("dotenv").config();
import express, { NextFunction, Request, Response, response } from "express";
import config from "config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import validateEnv from "./utils/validateEnv";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import collectionRouter from "./routes/collection.routes";
import commentRouter from "./routes/comment.routes";
import likeRouter from "./routes/like.routes";
import uploadRouter from "./routes/upload.routes";
import AppError from "./utils/appError";
import prisma from "./utils/connectPrisma";

validateEnv();

const app = express();

async function bootstrap() {
  // TEMPLATE ENGINE
  app.set("view engine", "pug");
  app.set("views", `${__dirname}/views`);

  // MIDDLEWARE

  // 1.Body Parser
  app.use(express.json({ limit: "10kb" }));

  // 2. Cookie Parser
  app.use(cookieParser());

  // 2. Cors
  app.use(
    cors({
      origin: [config.get<string>("origin")],
      credentials: true,
    })
  );

  // 3. Logger
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  // ROUTES
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/collections", collectionRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/likes", likeRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/images", express.static("public"));

  // Testing
  app.get("/api/healthchecker", (_, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to NodeJs with Prisma and PostgreSQL",
    });
  });

  // UNHANDLED ROUTES
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  const port = config.get<number>("port");
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
