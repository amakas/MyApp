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
  getMyPosts,
} from "../controllers/postsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/myposts", verifyToken, getMyPosts);
router.get("/user/:userId", verifyToken, getPostsByUser);

router.get("/", verifyToken, getPosts);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id", verifyToken, updatePost);
router.put("/like/:userId/:postId", verifyToken, like);
router.put("/share/:postId", verifyToken, share);
router.post("/report/:postId", verifyToken, report);
router.get("/post/:postId", verifyToken, getPost);
router.put("/view/:postId", verifyToken, getViews);
router.get("/followings", verifyToken, getFollowingsPosts);
router.delete("/deleteAll", verifyToken, deletepostsByUser);
export default router;
