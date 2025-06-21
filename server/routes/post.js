import express from 'express';
import {createPost} from '../controllers/postsController.js'
import {getPostsByUser} from '../controllers/postsController.js'
import {verifyToken} from '../middleware/auth.js';
const router = express.Router();

router.post('/',verifyToken, createPost)
router.get('/user/:userId',  getPostsByUser);

export default router 