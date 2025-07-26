import express from "express";
import {
  getMessages,
  getUserMessages,
} from "../controllers/messagesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getMessages);
router.get("/:personId", verifyToken, getUserMessages);

export default router;
