import express from "express";
import { getAllUsers } from "./user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRoutes = express.Router();

userRoutes.get("/", authMiddleware, getAllUsers);

export default userRoutes;
