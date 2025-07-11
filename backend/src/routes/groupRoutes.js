import { Router } from "express";
import { allGroups, createGroup, joinGroup, updateGroup, deleteGroup } from "../controllers/groupController.js";

const router = Router();

router.route("/").get(allGroups)
router.route("/join").post(joinGroup);
router.route("/create").post(createGroup);

router.route("/:id")
.put(updateGroup)
.delete(deleteGroup)



export default router;