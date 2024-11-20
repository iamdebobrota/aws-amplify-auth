import cors from "cors";
import express, { Request, Response } from "express";
import env from "./config/environment.config";
import userRoutes from "./user/user.routes";
import authRoutes from "./auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: env.app.appUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-KEY"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_req, res) => {
  res.status(200).send("Health Check Success...");
});

app.all("*", (_req: Request, res: Response) => {
  res.status(404).send("Route does not exist");
});
app.use(errorHandler);
export default app;
