import { Router } from "express";
import { addToHistory, getUserData, updateUser, getUserHistory, login, signup } from "../controllers/userController.js";

const router = Router();

router.route("/").put(updateUser)

router.route("/signup").post(signup);

router.route("/login").get(getUserData).post(login);

router.route("/add_to_history").post(addToHistory);

router.route("/get_all_history").get(getUserHistory);

export default router;
