const TTTURL = "http://localhost:3000/api/v1/ttt";
const TTSURL = "http://localhost:3000/api/v1/tts";

// Helper functions
const speechToText = async (audioBuffer, mimetype, originalname) => {
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: mimetype });

  formData.set("file", blob, originalname || "audio.wav");
  formData.set("model", "saarika:flash");
  formData.set("language_code", "unknown");

  const response = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: {
      "api-subscription-key": process.env.API_KEY,
      ...formData.headers,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Speech-to-text failed");
  }

  return await response.json();
};

const textTranslate = async (text, targetLanguage) => {
  const payload = {
    text: text,
    targetLanguage: targetLanguage,
  };

  const response = await fetch(TTTURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Translation failed with status ${response.status}`);
  }

  return await response.json();
};

const textToSpeech = async (text, targetLanguage) => {
  const response = await fetch(TTSURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      target_language_code: targetLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS failed with status ${response.status}`);
  }

  return await response.json();
};

// Main controller functions
export const getSpeechToSpeech = (req, res) => {
  res.json({
    message:
      "This is the Speech to Speech API endpoint. Please use POST method with audio data.",
    status: "success",
  });
};

export const postSpeechToSpeech = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Missing audio file in request." });
    }

    const { buffer: audioBuffer, mimetype, originalname } = req.file;

    // Step 1: Speech to Text
    const sttResult = await speechToText(audioBuffer, mimetype, originalname);
    if (!sttResult.transcript) {
      throw new Error("No transcript received from speech-to-text service");
    }

    // Step 2: Text Translation
    const targetLanguage =
      sttResult.language_code === "en-IN" ? "od-IN" : "en-IN";
    const translation = await textTranslate(
      sttResult.transcript,
      targetLanguage
    );
    if (!translation.translation) {
      throw new Error("No translation received");
    }

    // Step 3: Text to Speech
    const ttsResult = await textToSpeech(
      translation.translation,
      targetLanguage
    );
    if (!ttsResult.audios || ttsResult.audios.length === 0) {
      throw new Error("No audio received from TTS service");
    }

    // Success response
    res.json({
      message: "Speech to Speech conversion successful",
      audio: ttsResult.audios[0],
      language_code: sttResult.language_code,
      transcript: sttResult.transcript,
      translated_text: translation.translation,
    });
  } catch (error) {
    console.error("Error in speech-to-speech conversion:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

export default {
  getSpeechToSpeech,
  postSpeechToSpeech,
};
