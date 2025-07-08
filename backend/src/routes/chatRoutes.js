import { Router } from "express";
import { allChats, createChat, joinChat } from "../controllers/chatController.js";

const router = Router();

router.route("/").get(allChats)
router.route("/join").post(joinChat);
router.route("/create").post(createChat);

export default router;