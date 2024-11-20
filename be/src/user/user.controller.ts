import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "./user.entity";

const userRepository = AppDataSource.getMongoRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    res.json(users);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};
