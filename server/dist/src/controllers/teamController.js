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
exports.createTeam = exports.getTeam = exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const handleServerError_1 = require("../lib/handleServerError");
const prisma = new client_1.PrismaClient();
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield prisma.team.findMany({
            include: {
                productOwner: {
                    select: { username: true, fullName: true },
                },
                projectManager: {
                    select: { username: true, fullName: true },
                },
            },
        });
        const teamsWithUsernames = teams.map((team) => {
            var _a, _b, _c, _d;
            return (Object.assign(Object.assign({}, team), { 
                // productOwnerUsername: team.productOwner?.username ?? null,
                // projectManagerUsername: team.projectManager?.username ?? null,
                productOwner: {
                    username: (_a = team.productOwner) === null || _a === void 0 ? void 0 : _a.username,
                    fullName: (_b = team.productOwner) === null || _b === void 0 ? void 0 : _b.fullName,
                }, projectManager: {
                    username: (_c = team.projectManager) === null || _c === void 0 ? void 0 : _c.username,
                    fullName: (_d = team.projectManager) === null || _d === void 0 ? void 0 : _d.fullName,
                } }));
        });
        res.json(teamsWithUsernames);
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error, "Error retrieving teams");
    }
});
exports.getTeams = getTeams;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId } = req.params;
    try {
        const team = yield prisma.team.findUnique({
            where: {
                id: Number(teamId),
            },
        });
        res.json(team);
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error, "Error retrieving team");
    }
});
exports.getTeam = getTeam;
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
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
    try {
        const newTeam = yield prisma.team.create({
            data: {
                teamName,
                productOwnerUserId,
                projectManagerUserId,
            },
        });
        res.status(201).json(newTeam);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating team: ${error.message}` });
    }
});
exports.createTeam = createTeam;
