import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/user.entity";

const userRepository = AppDataSource.getMongoRepository(User);

// Secret key for JWT (should be in `.env`)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Register a new user
export const registerUser = async (email: string, password: string) => {
  const existingUser = await userRepository.findOneBy({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User();
  user.email = email;
  user.password = hashedPassword;

  return await userRepository.save(user);
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return { token, user };
};
