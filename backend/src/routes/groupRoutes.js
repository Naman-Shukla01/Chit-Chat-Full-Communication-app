import { Router } from "express";
import { allGroups, createGroup, joinGroup, updateGroup, deleteGroup } from "../controllers/groupController.js";

const router = Router();

router.route("/").get(allGroups).put(updateGroup)
router.route("/join").post(joinGroup);
router.route("/create").post(createGroup);
router.route("/delete/:groupId").delete(deleteGroup)



export default router;