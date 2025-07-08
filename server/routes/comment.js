import express from "express";
import { sendComment, getComments } from "../controllers/commentsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:userId/:postId", verifyToken, sendComment);
router.get("/:postId", verifyToken, getComments);

export default router;
