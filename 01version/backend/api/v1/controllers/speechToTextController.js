import { convertSpeechToText } from '../utils/convertSpeechToText.js'

export const getSpeechToText = (req, res) => {
  res.json({
    message:
      "This is the Speech to Text API endpoint. Please use POST method with audio data.",
    status: "success",
  });
};

export const postSpeechToText = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file in request." });
    }

    // Call utility function - options are completely optional
    // You can call it in any of these ways:

    // 1. Use all defaults:
    const result = await convertSpeechToText(req.file);

    // 2. Override only specific options:
    // const result = await convertSpeechToText(req.file, { model: 'custom-model' });

    // 3. Override multiple options:
    // const result = await convertSpeechToText(req.file, {
    //   model: 'custom-model',
    //   languageCode: 'en-US'
    // });

    res.json(result);
  } catch (error) {
    console.error("Controller error:", error.message);

    // Return appropriate HTTP status based on error type
    const statusCode = error.message.includes('Missing audio file') ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export default {
  getSpeechToText,
  postSpeechToText,
};
