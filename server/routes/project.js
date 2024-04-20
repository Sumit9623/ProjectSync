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

import {addTask, getTask, updateTask, deleteTask, addTaskMember, removeTaskMember} from "../controllers/task.js";
import { addIssue, getIssue, updateIssue, deleteIssue } from "../controllers/issue.js";
import { verifyToken } from "../middleware/verifyToken.js";

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
router.post("/task/createTask/:id", verifyToken, addTask)     // done  --> date modification
router.get("/task/getTask/:id", verifyToken, getTask)         // done
router.patch("/task/updateTask/:id", verifyToken, updateTask)  // done
router.delete("/task/deleteTask/:id", verifyToken, deleteTask) // done
router.patch("/task/addMember/:id", verifyToken, addTaskMember)   // done
router.patch("/task/removeMember/:id", verifyToken, removeTaskMember)   // done

// issues
router.post("/issues/createIssue/:id", verifyToken, addIssue)  // done
router.get("/issues/getIssue/:id", verifyToken, getIssue)      // done
router.patch("/issues/updateIssue/:id", verifyToken, updateIssue)  // done
router.delete("/issues/deleteIssue/:id", verifyToken, deleteIssue) // done


export default router;