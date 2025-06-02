import { FormData } from 'formdata-node';
import { Blob } from 'fetch-blob';


const API_SECRET = process.env.API_KEY;

export const getSpeechToText = (req, res) => {
  res.json({
    message:
      "This is the Speech to Text API endpoint. Please use POST method with audio data.",
    status: "success",
  });
};

export const postSpeechToText = async (req, res) => {
  const audioBuffer = req.file?.buffer;

  console.log(audioBuffer)
  if (!audioBuffer) {
    return res.status(400).json({ error: "Missing audio file in request." });
  }

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: req.file.mimetype });

  formData.set('file', blob, 'audio.wav');
  formData.set('model', 'saarika:flash');
  formData.set('language_code', 'unknown');

  try {
    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': 'b653a142-ba6c-4e47-b6ce-6b04f5acafcd',
        ...formData.headers, // includes correct content-type boundary
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Speech-to-text failed');

    res.json(data);
  } catch (err) {
    console.error("Error converting speech to text:", err);
    res.status(500).json({ error: err.message });
  }
};



export default {
  getSpeechToText,
  postSpeechToText,
};
