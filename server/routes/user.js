import express from "express";
import {updateUser,deleteUser,getUserDetails,getUserProjects,getUserTeams,getUserTasks,getUserIssues,findUserByEmail,} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//update user
router.get("/getProjects", verifyToken, getUserProjects); //done
router.get("/getTeams", verifyToken, getUserTeams);       // done
router.get("/getIssues", verifyToken, getUserIssues);     // done
router.get("/getTasks", verifyToken, getUserTasks);       // done
router.get("/getUser",verifyToken, getUserDetails);    // done
router.put("/updateUser/", verifyToken, updateUser);       // done
router.get("/search/:email",verifyToken, findUserByEmail);  // done



export default router;