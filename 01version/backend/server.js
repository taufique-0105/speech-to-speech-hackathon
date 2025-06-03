import express from "express";
import fetch from "node-fetch"; // Ensure you install node-fetch v2
import cors from "cors";
import "dotenv/config";

import textToSpeechRouter from "./api/v1/routes/textToSpeechRouter.js"
import speechToTextRouter from "./api/v1/routes/speechToTextRouter.js";
import speechToSpeechRouter from "./api/v1/routes/speechToSpeechRouter.js";
import textToTextRouter from "./api/v1/routes/textToTextRouter.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, this is the API for OdiaAudioGen!");
});

app.use('/api/v1/tts', textToSpeechRouter);
app.use('/api/v1/stt', speechToTextRouter);
app.use('/api/v1/sts', speechToSpeechRouter);
app.use('/api/v1/ttt', textToTextRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
