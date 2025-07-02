import express from 'express';
import { getMessages } from '../controllers/messagesController.js';

const router = express.Router();

router.get('/', getMessages);

export default router;