import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
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
      ownerId: userId,
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
    const tournament = await prisma.tournament.delete({
      where: {
        id: req.params.id,
      },
    });
  }
);
export const getTournaments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournaments = await prisma.tournament.findMany({
      include: {
        owner: true,
      },
    });
    res.status(200).json({
      tournaments,
    });
  }
);
export const getTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournament = await prisma.tournament.findFirst({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      tournament,
    });
  }
);

export const searchResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.search as string;
    console.log(searchQuery);
    const tournaments = await prisma.tournament.findMany({
      where: {
        OR: [{ game: searchQuery }, { name: searchQuery }],
      },
    });
    const users = await prisma.user.findMany({
      where: {
        name: searchQuery,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      data: {
        users,
        tournaments,
      },
    });
  }
);
