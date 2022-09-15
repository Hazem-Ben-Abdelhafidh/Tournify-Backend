import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import prisma from "../utils/prisma";

// protect middleware
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    const authHeader =
      (req.headers.authorization as string) ||
      (req.headers.Authorization as string);

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          HttpStatusCode.UNAUTHORIZED
        )
      );
    }

    // 2) Verification token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return next(new AppError("Nope", HttpStatusCode.FORBIDDEN));
      // 3) Check if user still exists
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded?.id },
      });
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            HttpStatusCode.UNAUTHORIZED
          )
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      next();
    });
  }
);
