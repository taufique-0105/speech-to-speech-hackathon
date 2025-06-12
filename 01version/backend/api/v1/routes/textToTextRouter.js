import express, { text } from 'express';
import textToTextController from '../controllers/textToTextController.js';

const router = express.Router();

router.get('/', textToTextController.getTextToText);
router.post('/', textToTextController.postTextToText);

export default router;