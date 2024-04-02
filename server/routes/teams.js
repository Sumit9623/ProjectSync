import express from "express";
import { addTeam, getTeam, deleteTeam, updateTeam, addTeamProject, inviteTeamMember, verifyInvitationTeam, getTeamMembers, removeMember, updateMembers } from "../controllers/teams.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { localVariables } from "../middleware/auth.js";

const router = express.Router();

//create a Team
router.post("/createTeam",verifyToken,addTeam);
router.get("/getTeam/:id",verifyToken, getTeam)
router.delete("/deleteTeam/:id", verifyToken, deleteTeam)
router.patch("/updateTeam/:id", verifyToken, updateTeam)
router.patch("/updateMember/:id", verifyToken, updateMembers)
router.patch("/removeMember/remove/:id", verifyToken, removeMember)
router.post("/addProject/:id", verifyToken, addTeamProject)
router.post("/invite/:id", verifyToken,localVariables, inviteTeamMember)
router.get("/invite/:code",verifyInvitationTeam)
router.get("/members/:id", verifyToken, getTeamMembers)


export default router;