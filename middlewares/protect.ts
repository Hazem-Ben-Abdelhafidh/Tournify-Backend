import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import { promisify } from "util";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import prisma from "../utils/prisma";

// protect middleware
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError("You need to login first", 401));
    }
    const decoded: JwtPayload = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!currentUser) {
      return next(
        new AppError("the user belonging to this token no longer exists", 401)
      );
    }
    req.user = currentUser;

    next();
  }
);
