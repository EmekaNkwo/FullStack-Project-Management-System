"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const generateId_1 = require("../lib/generateId");
const prisma = new client_1.PrismaClient();
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving projects: ${error.message}` });
    }
});
exports.getProjects = getProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, startDate, endDate } = req.body;
    const existingProject = yield prisma.project.findFirst({
        where: { name },
    });
    if (existingProject) {
        res.status(409).json({
            message: "A project with the same name already exists",
        });
        return;
    }
    try {
        const newProject = yield prisma.project.create({
            data: {
                id: (0, generateId_1.generateFiveDigitNumber)(),
                name,
                description: description || undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        console.error("Full project creation error:", error);
        // More specific error handling
        if (error.code === "P2002") {
            res.status(409).json({
                message: "A project with similar unique constraints already exists",
                errorDetails: error.meta,
            });
        }
        else {
            res.status(500).json({
                message: `Error creating a project: ${error.message}`,
                errorCode: error.code,
                errorMeta: error.meta,
            });
        }
    }
});
exports.createProject = createProject;
