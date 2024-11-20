import express from "express";
import { login, register } from "./auth.controller";

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", register);

export default authRoutes;
