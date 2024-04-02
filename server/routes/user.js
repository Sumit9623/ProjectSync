import express from "express";
import {updateUser,deleteUser,getUserDetails,getUserProjects,getUserTeams,getUserTasks,getUserIssues,findUserByEmail,} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//update user
router.get("/:id",verifyToken, getUserDetails);    // done
router.put("/:id", verifyToken, updateUser);       // done
router.delete("/:id", verifyToken, deleteUser);    // done
router.get("/projects", verifyToken, getUserProjects);
router.get("/teams", verifyToken, getUserTeams);
router.get("/issues", verifyToken, getUserIssues);
router.get("/tasks", verifyToken, getUserTasks);
router.get("/search/:email",verifyToken, findUserByEmail);



export default router;