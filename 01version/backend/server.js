import express from "express";
import fetch from "node-fetch"; // Ensure you install node-fetch v2
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;
const API_SECRET = process.env.API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is the API for OdiaAudioGen!");
});

app.get("/api/data", (req, res) => {
  res.json({ message: "This is some sample data" });
});

app.post("/api/v1/tts", async (req, res) => {
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
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
