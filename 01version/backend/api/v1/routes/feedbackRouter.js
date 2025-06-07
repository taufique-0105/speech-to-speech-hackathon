import express from 'express';
import { getFeedback, submitFeedback } from '../controllers/feedbackControllers.js';

const router = express.Router();

router.post('/submit', submitFeedback);


// Need to add a restriction for this route so everyone doesn't be able to access it as it will contain sensitive data.
router.get('/', getFeedback);

export default router;
