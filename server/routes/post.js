import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostsByUser,
  share,
  like,
  report,
  getPost,
  getViews,
  getFollowingsPosts,
  deletepostsByUser,
} from "../controllers/postsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/user/:userId", getPostsByUser);
router.get("/:userId", getPosts);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id", verifyToken, updatePost);
router.put("/like/:userId/:postId", verifyToken, like);
router.put("/share/:postId", verifyToken, share);
router.post("/report/:postId", verifyToken, report);
router.get("/post/:postId", verifyToken, getPost);
router.get("/view/:postId", verifyToken, getViews);
router.get("/followings/:userId", verifyToken, getFollowingsPosts);
router.delete("/deleteAll/:userId", verifyToken, deletepostsByUser);
export default router;
