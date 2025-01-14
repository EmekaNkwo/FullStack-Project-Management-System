import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { excludePassword, generateFiveDigitNumber } from "../lib/generateId";
import { handleServerError } from "../lib/handleServerError";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    const tasksWithoutPasswords = tasks.map((task) => ({
      ...task,
      author: task.author ? excludePassword(task.author) : null,
      assignee: task.assignee ? excludePassword(task.assignee) : null,
    }));
    res.json(tasksWithoutPasswords);
  } catch (error: unknown) {
    handleServerError(res, error, "Error retrieving tasks");
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        id: generateFiveDigitNumber(),
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    // Remove password from author and assignee
    const tasksWithoutPasswords = tasks.map((task) => ({
      ...task,
      author: task.author ? excludePassword(task.author) : null,
      assignee: task.assignee ? excludePassword(task.assignee) : null,
    }));
    res.json(tasksWithoutPasswords);
  } catch (error: unknown) {
    handleServerError(res, error, "Error retrieving tasks");
  }
};
