import express, { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import prisma from "../utils/prisma";

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        name: true,
        id: true,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      user,
    });
  }
);
