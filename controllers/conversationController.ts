import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import prisma from "../utils/prisma";

export const getConversations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: req.user?.id,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      conversations,
    });
  }
);
export const getConversation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: req.params.id,
      },
      include: { messages: true },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      conversation,
    });
  }
);
