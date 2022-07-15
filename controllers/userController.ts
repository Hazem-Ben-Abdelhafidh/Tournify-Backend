import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
interface sl {
  name: string;
  email: string;
}
const prisma = new PrismaClient();
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email }: sl = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });
  res.json({
    user,
  });
}
