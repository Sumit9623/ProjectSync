import express from "express";
import { signup,signin, logout, resetPassword,verifypassword } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import  {localVariables}  from "../middleware/auth.js";

const router = express.Router();

//create a user
router.post("/signup", signup);  // done
router.post("/signin", signin);  // done
router.post("/logout", logout);  // done
router.put("/forgetpassword",verifyToken,resetPassword);
router.put("/verifypassword", verifypassword);




export default router;