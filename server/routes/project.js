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
     } from "../controllers/project.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { localVariables } from "../middleware/auth.js";

const router = express.Router();

//create a project
router.post("/createProject", verifyToken, addProject);   // done
router.get("/:id", verifyToken, getProject)               // done
router.put("/:id", verifyToken, updateProject)            // done
router.delete("/:id", verifyToken, deleteProject)         // done
router.post("/invite/:id", verifyToken, inviteProjectMember)    // done
router.get("/invite/verify", verifyInvitation)                  // done
router.patch("/member/remove/:id", verifyToken, removeMember)   //done
router.get("/members/:id",verifyToken, getProjectMembers)       // done

//works
// router.post("/task/createTask/:id", verifyToken, addTask)
// router.get("/task/getTask/:id", verifyToken, getTask)
// router.get("/task/updateTask/:id", verifyToken, getTask)
// router.get("/task/addMember/:id", verifyToken, getTask)
// router.get("/task/removeMember/:id", verifyToken, getTask)

// issues
// router.post("/isuues/createIssue/:id", verifyToken, addIssue)
// router.get("/issues/getIssue/:id", verifyToken, getIssue)
// router.get("/issues/updateIssue/:id", verifyToken, getIssue)
// router.get("/issues/addMember/:id", verifyToken, getIssue)
// router.get("/issues/RemoveMember/:id", verifyToken, getIssue)


export default router;