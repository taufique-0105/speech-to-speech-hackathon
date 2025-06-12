import express, { text } from 'express';
import textToSpeechHandler from '../controllers/textToSpeechController.js';

const router = express.Router();


router.get('/', textToSpeechHandler.getTextToSpeech);
router.post('/', textToSpeechHandler.postTextToSpeech);

export default router;