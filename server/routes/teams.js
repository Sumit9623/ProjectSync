import express from "express";
import { addTeam, getTeam, deleteTeam, updateTeam, addTeamProject, inviteTeamMember, verifyInvitationTeam, getTeamMembers, removeMember, updateMembers } from "../controllers/teams.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//create a Team
router.post("/createTeam",verifyToken,addTeam)             // done
router.get("/getTeam/:id",verifyToken, getTeam)            // done
router.patch("/updateTeam/:id", verifyToken, updateTeam)   // done
router.delete("/deleteTeam/:id", verifyToken, deleteTeam)  // done
router.post("/invite/:id", verifyToken, inviteTeamMember)  // done
router.get("/invite/verify",verifyInvitationTeam)          // done
router.patch("/removeMember/:id", verifyToken, removeMember)  // done
router.post("/addProject/:id", verifyToken, addTeamProject)   // done
router.get("/members/:id", verifyToken, getTeamMembers)       // done


export default router;