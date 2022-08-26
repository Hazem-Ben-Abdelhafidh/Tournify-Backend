import { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import prisma from "../utils/prisma";
export const messageHandler = (io: Server, socket: Socket) => {
  socket.on("message", async (socket) => {
    console.log("d5alna");
    const conversation = await prisma.conversation.findFirst({
      where: {
        recieverId: socket.recieverId,
        userId: socket.senderId,
      },
    });
    console.log("lenna");
    if (conversation) {
      console.log("reciverId: ", socket.recieverId);
      const message1 = await prisma.message.create({
        data: {
          text: socket.message,
          senderId: socket.senderId,
          conversationId: conversation.id,
          recieverId: socket.recieverId,
        },
      });
    } else {
      const newConversation = await prisma.conversation.create({
        data: {
          recieverId: socket.recieverId,
          userId: socket.senderId,
        },
      });
      const message2 = await prisma.message.create({
        data: {
          text: socket.message,
          recieverId: newConversation.recieverId,
          senderId: socket.senderId,
          conversationId: newConversation.id,
        },
      });
    }
  });
};
export const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await prisma.message.findMany({
      where: {
        senderId: req.user?.id,
        recieverId: req.params.reciverId,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      messages,
    });
  }
);
