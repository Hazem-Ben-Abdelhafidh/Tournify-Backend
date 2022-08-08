import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
const prisma = new PrismaClient();

export async function createTournament(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const tournament = await prisma.tournament.create({
    data: {
      ...req.body,
      userId,
    },
  });
  res.json(tournament);
}
export const updateTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournament = await prisma.tournament.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
  }
);

export const deleteTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournament = prisma.tournament.delete({
      where: {
        id: req.params.id,
      },
    });
  }
);
export const getTournaments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournaments = prisma.tournament.findMany();
    res.status(200).json({
      tournaments,
    });
  }
);
export const getTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournament = prisma.tournament.findFirst({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      tournament,
    });
  }
);
