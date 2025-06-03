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
  const audioBuffer = req.file.buffer;
  const mimetype = req.file.mimetype;
  console.log("Received audio file:", req.file.originalname, "with mimetype:", mimetype);
  console.log("Audio buffer length:", audioBuffer.length);
  if (!audioBuffer) {
    return res.status(400).json({ error: "Missing audio file in request." });
  }

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: mimetype });

  formData.set('file', blob, req.file.originalname || 'audio.wav');
  formData.set('model', 'saarika:flash');
  formData.set('language_code', 'unknown');

  try {
    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': API_SECRET,
        ...formData.headers,
      },
      body: formData
    });

    const data = await response.json();
    console.log("Data in response:",data)

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
