import { convertSpeechToText } from "../utils/convertSpeechToText.js";
import { convertTextToSpeech } from "../utils/convertTextToSpeech.js";
import { translateText } from "../utils/translateText.js";

export const getSpeechToSpeech = (req, res) => {
  res.json({
    message:
      "This is the Speech to Speech API endpoint. Please use POST method with audio data.",
    status: "success",
  });
};

export const postSpeechToSpeech = async (req, res) => {
  try {
    // Step 1 Speech to Text
    const speechResult = await convertSpeechToText(req.file);

    console.log("Speech to Text Result:", speechResult.language_code, speechResult.transcript);

    const targetLanguage = speechResult.language_code === "en-IN" ? "od-IN" : "en-IN";
    console.log("targetLanguage",targetLanguage)
    // Step 2 Text Translation
    const translationResult = await translateText(speechResult.transcript, targetLanguage);

    // Step 3 Text to Speech
    const ttsResult = await convertTextToSpeech(translationResult.translation, {
      targetLanguageCode: speechResult.language_code === "en-IN" ? "od-IN" : "en-IN",
    });

    res.json({
      message: "Speech to Speech conversion successful",
      originalAudio: req.file.originalname,
      transcript: speechResult.transcript,
      translation: translationResult.translation,
      audio: ttsResult.audios[0],
      pipeline: {
        sourceLanguage: translationResult.sourceLanguage,
        targetLanguage: translationResult.targetLanguage,
      },
    });
  } catch (error) {
    // Handle pipeline errors gracefully
    res.status(500).json({ error: error.message });
  }
};

export default {
  getSpeechToSpeech,
  postSpeechToSpeech,
};
