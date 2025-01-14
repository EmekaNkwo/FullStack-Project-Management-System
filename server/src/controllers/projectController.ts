import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateFiveDigitNumber } from "../lib/generateId";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  const existingProject = await prisma.project.findFirst({
    where: { name },
  });

  if (existingProject) {
    res.status(409).json({
      message: "A project with the same name already exists",
    });
    return;
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        id: generateFiveDigitNumber(),
        name,
        description: description || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Full project creation error:", error);

    // More specific error handling
    if (error.code === "P2002") {
      res.status(409).json({
        message: "A project with similar unique constraints already exists",
        errorDetails: error.meta,
      });
    } else {
      res.status(500).json({
        message: `Error creating a project: ${error.message}`,
        errorCode: error.code,
        errorMeta: error.meta,
      });
    }
  }
};
