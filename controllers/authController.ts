import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt/tokens";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError("You need to login first", 401));
    }
  }
);
// log User
const logUser = (res: Response, user: User) => {
  const accessToken = generateAccessToken(user);

  res.status(200).json({
    status: "success",
    accessToken,
    data: { user },
  });
};
interface signupBody {
  name: string;
  email: string;
  password: string;
}
// signup
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { name, email, password }: signupBody = req.body;
    password = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    logUser(res, newUser);
  }
);

// login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: Pick<signupBody, "email" | "password"> =
      req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return next(new AppError("User doesn't exist "));
    }
    if (!(await bcrypt.compare(user.password!, password!))) {
      return next(new AppError("Credentials are wrong!"));
    }
    logUser(res, user);
  }
);
