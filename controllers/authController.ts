import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt/tokens";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import { client } from "../redis";

interface signupBody {
  name: string;
  email: string;
  password: string;
}
// log User
const logUser = async (res: Response, user: User) => {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  await client.setEx(user.id, 259200, refreshToken);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  });
  res.status(HttpStatusCode.OK).json({
    status: "success",
    accessToken,
    data: { user },
  });
};

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
        email: email,
      },
    });
    if (!user) {
      return next(new AppError("User doesn't exist "));
    }
    if (!(await bcrypt.compare(password, user.password!))) {
      return next(new AppError("Credentials are wrong!"));
    }
    logUser(res, user);
  }
);
