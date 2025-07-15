import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  follow,
  followers,
  followings,
  getUserByPost,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.put("/:id", upload.single("profilePicture"), verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/all/:id", verifyToken, getAllUsers);
router.get("/followers/:id", verifyToken, followers);
router.get("/followings/:id", verifyToken, followings);
router.put("/follow/:id", verifyToken, follow);
router.get("/post/:postId", verifyToken, getUserByPost);
export default router;
