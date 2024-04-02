import express from "express";
import {
    addProject,
    deleteProject,
    getProject,
    updateProject,
    removeMember,
    inviteProjectMember,
    verifyInvitation,
    getProjectMembers,
    addTask,
    getTask,
    addIssue,
    getIssue,
    updateMembers,
     } from "../controllers/project.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { localVariables } from "../middleware/auth.js";

const router = express.Router();

//create a project
router.post("/createProject", verifyToken, addProject);   // done
router.get("/:id", verifyToken, getProject)               // done
router.put("/:id", verifyToken, updateProject)
router.delete("/:id", verifyToken, deleteProject)
router.patch("/member/:id", verifyToken, updateMembers)
router.patch("/member/remove/:id", verifyToken, removeMember)
router.post("/invite/:id", verifyToken, localVariables, inviteProjectMember)
router.get("/invite/:code", verifyInvitation)
router.get("/members/:id",verifyToken, getProjectMembers)

//works
router.post("/task/:id", verifyToken, addTask)
router.get("/task/:id", verifyToken, getTask)

// issues
router.post("/isuues/:id", verifyToken, addIssue)
router.get("/issues/:id", verifyToken, getIssue)


export default router;