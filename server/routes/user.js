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
  getUserChats,
  getMe,
} from "../controllers/userController.js";
import { deletepostsByUser } from "../controllers/postsController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/me", verifyToken, getMe);
router.get("/all", verifyToken, getAllUsers);
router.get("/messages", verifyToken, getUserChats);
router.put("/", upload.single("profilePicture"), verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser, deletepostsByUser);
router.get("/:id", verifyToken, getUser);

router.get("/followers/:id", verifyToken, followers);
router.get("/followings/:id", verifyToken, followings);
router.put("/follow/:id", verifyToken, follow);
router.get("/post/:postId", verifyToken, getUserByPost);

export default router;
