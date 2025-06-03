import express from 'express';
import speechToSpeechController from '../controllers/speechToSpeechController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get('/', speechToSpeechController.getSpeechToSpeech);
router.post('/', upload.single("audio"), speechToSpeechController.postSpeechToSpeech);

export default router;