import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import helmet from "helmet";
import { reqLogger } from "./middleware/reqLogger.middleware.js";

export const app = express();

app.use(corsMiddleware);
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(reqLogger);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Server.js  of user-service");
});

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    message: "ok",
  });
});
