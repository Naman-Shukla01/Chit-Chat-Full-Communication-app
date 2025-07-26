import { Router } from "express";
import { allChats, createChat, joinChat, deleteChat } from "../controllers/chatController.js";

const router = Router();

router.route("/").get(allChats)
router.route("/join").post(joinChat);
router.route("/create").post(createChat);
router.route("/delete/:chatId").delete(deleteChat);

export default router;