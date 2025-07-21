import express from "express";
import {
  getMessages,
  getUserMessages,
} from "../controllers/messagesController.js";

const router = express.Router();

router.get("/", getMessages);
router.get("/:personId/:userId", getUserMessages);

export default router;
