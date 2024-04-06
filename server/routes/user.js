import express from "express";
import {updateUser,deleteUser,getUserDetails,getUserProjects,getUserTeams,getUserTasks,getUserIssues,findUserByEmail,} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//update user
router.get("/projects", verifyToken, getUserProjects); //done
router.get("/teams", verifyToken, getUserTeams);
router.get("/issues", verifyToken, getUserIssues);
router.get("/tasks", verifyToken, getUserTasks);
router.get("/getUser",verifyToken, getUserDetails);    // done
router.put("/updateUser/", verifyToken, updateUser);       // done
router.get("/search/:email",verifyToken, findUserByEmail);



export default router;