const API_SECRET = process.env.API_KEY;

export function getTextToSpeech(req, res) {
  res.json({
    message: "This is the text-to-speech endpoint",
    data: {
      text: "Hello, this is a sample text for TTS.",
      target_language_code: "en-US",
    },
  });
}

export async function postTextToSpeech(req, res) {
  const { text, target_language_code } = req.body;

  if (!text || !target_language_code) {
    return res.status(400).json({
      error: "Missing 'text' or 'target_language_code' in request body.",
    });
  }

  try {
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "api-subscription-key": API_SECRET, // Use env in prod
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target_language_code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const ttsResult = await response.json();

    // Validate structure before sending to frontend
    if (!ttsResult.audios || !Array.isArray(ttsResult.audios)) {
      return res.status(500).json({ error: "Invalid TTS response structure" });
    }

    res.json({
      request_id: ttsResult.request_id || "unknown",
      audios: ttsResult.audios,
    });
  } catch (error) {
    console.error("Error calling TTS API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getTextToSpeech,
  postTextToSpeech,
};
