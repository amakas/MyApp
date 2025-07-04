import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  follow,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.put("/:id", upload.single("profilePicture"), verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/all/:id", verifyToken, getAllUsers);
router.put("/follow/:id", verifyToken, follow);
export default router;
