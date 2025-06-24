import express from 'express';
import {createPost} from '../controllers/postsController.js'
import {getPostsByUser} from '../controllers/postsController.js'
import {verifyToken} from '../middleware/auth.js';
import { getPosts } from '../controllers/postsController.js';
import  { deletePost } from '../controllers/postsController.js';
import { updatePost } from '../controllers/postsController.js';
const router = express.Router();

router.post('/',verifyToken, createPost)
router.get('/user/:userId',  getPostsByUser);
router.get('/:userId', getPosts);
router.delete('/:id', verifyToken, deletePost);
router.put('/:id', verifyToken, updatePost)

export default router 