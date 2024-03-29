import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import AppError from "../utils/appError";
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
    const tournament = await prisma.tournament.findFirst({
      where: { id: req.params.id },
    });
    // logged in user not the owner of the tournament
    if (!(tournament?.ownerId === req.user?.id))
      return next(new AppError("You are not the owner of this tournament!"));

    // logged in user is the owner of the tournament
    await prisma.tournament.delete({
      where: {
        id: req.params.id,
      },
    });
    await prisma.join.deleteMany({
      where: {
        tournamentId: req.params.id,
      },
    });
    res.status(HttpStatusCode.OK);
  }
);
export const getTournaments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournaments = await prisma.tournament.findMany({
      include: {
        owner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      tournaments,
    });
  }
);
export const getTournamentsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournaments = await prisma.tournament.findMany({
      where: {
        ownerId: req.params.id,
      },
      include: {
        owner: true,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      tournaments,
    });
  }
);
export const getTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: req.params.id,
      },
    });
    const owner = await prisma.user.findUnique({
      where: {
        id: tournament?.ownerId,
      },
      select: {
        name: true,
      },
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      data: {
        tournament,
        owner,
      },
    });
  }
);

export const searchResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.search as string;
    const tournaments = await prisma.tournament.findMany({
      where: {
        OR: [
          { game: { contains: searchQuery } },
          { name: { contains: searchQuery } },
        ],
      },
    });
    const users = await prisma.user.findMany({
      where: {
        name: { contains: searchQuery },
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

export const joinTournament = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const tournamentId = req.params.id;
    const tournament = await prisma.join.findFirst({
      where: {
        userId: userId,
        tournamentId: tournamentId,
      },
    });
    if (tournament)
      return next(
        new AppError(
          "you already joined this tournament",
          HttpStatusCode.FORBIDDEN
        )
      );
    const tournament2 = await prisma.join.create({
      data: {
        userId,
        tournamentId,
      },
    });
    res.status(HttpStatusCode.CREATED).json({
      status: "success",
      tournament: tournament2,
    });
  }
);

export const getParticipants = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const participants = await prisma.join.findMany({
      where: {
        tournamentId: req.params.id,
      },
      include: {
        user: true,
      },
    });
    participants.forEach((participant: { user: Partial<User> }) => {
      delete participant.user.password;
      delete participant.user.Role;
    });
    res.status(HttpStatusCode.ACCEPTED).json({
      status: "success",
      participants,
    });
  }
);
