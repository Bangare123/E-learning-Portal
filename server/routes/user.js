import express from "express";
import { register, loginUser,verifyUser, myProfile} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post('/user/register', register);
router.post("/user/Verifyuser", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
export default router;