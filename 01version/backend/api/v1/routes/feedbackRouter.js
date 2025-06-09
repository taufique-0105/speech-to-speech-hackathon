import express from 'express';
import { getFeedback, submitFeedback } from '../controllers/feedbackControllers.js';
import apiKeyAuth from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', submitFeedback);
router.get('/', apiKeyAuth, getFeedback);


export default router;
