import express from 'express';
import multer from 'multer';
import speechToSpeechController from '../controllers/speechToSpeechController.js';

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
