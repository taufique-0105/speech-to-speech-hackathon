import express from 'express';
import speechToTextController from '../controllers/speechToTextController.js';
import multer from 'multer';


const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', speechToTextController.getSpeechToText);
router.post('/', upload.single('file'), speechToTextController.postSpeechToText);

export default router;