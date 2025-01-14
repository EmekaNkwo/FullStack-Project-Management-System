import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { handleServerError } from "../lib/handleServerError";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        productOwner: {
          select: { username: true, fullName: true },
        },
        projectManager: {
          select: { username: true, fullName: true },
        },
      },
    });

    const teamsWithUsernames = teams.map((team) => ({
      ...team,
      // productOwnerUsername: team.productOwner?.username ?? null,
      // projectManagerUsername: team.projectManager?.username ?? null,
      productOwner: {
        username: team.productOwner?.username,
        fullName: team.productOwner?.fullName,
      },
      projectManager: {
        username: team.projectManager?.username,
        fullName: team.projectManager?.fullName,
      },
    }));

    res.json(teamsWithUsernames);
  } catch (error: unknown) {
    handleServerError(res, error, "Error retrieving teams");
  }
};

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamId } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: Number(teamId),
      },
    });
    res.json(team);
  } catch (error: unknown) {
    handleServerError(res, error, "Error retrieving team");
  }
};

// export const getTeams = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const teams = await prisma.team.findMany();
//     res.json(teams);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({
//         message: `Error retrieving teams: ${error.message}`,
//       });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred" });
//     }
//   }
// };

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;

  try {
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });

    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};
