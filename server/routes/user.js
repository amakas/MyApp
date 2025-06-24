import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.put('/:id', upload.single('profilePicture'), verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser)

export default router;