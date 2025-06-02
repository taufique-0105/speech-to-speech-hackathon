import express from 'express';
import speechToSpeechController from '../controllers/speechToSpeechController.js';

const router = express.Router();

router.get('/', speechToSpeechController.getSpeechToSpeech);

export default router;