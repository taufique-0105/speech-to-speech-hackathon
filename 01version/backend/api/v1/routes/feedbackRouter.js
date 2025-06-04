import express from 'express';
import { getFeedback, submitFeedback } from '../controllers/feedbackControllers.js';

const router = express.Router();

router.post('/submit', submitFeedback);
router.get('/', getFeedback);

export default router;