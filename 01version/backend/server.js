import express from "express";
import expressWinston from "express-winston";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";

import connectDB from "./api/v1/config/db.js";
import logger from "./logger.js";

// Import Routes
import textToSpeechRouter from "./api/v1/routes/textToSpeechRouter.js"
import speechToTextRouter from "./api/v1/routes/speechToTextRouter.js";
import speechToSpeechRouter from "./api/v1/routes/speechToSpeechRouter.js";
import textToTextRouter from "./api/v1/routes/textToTextRouter.js";
import feedbackRouter from "./api/v1/routes/feedbackRouter.js";

// ES6 modules __dirname equvalant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// Create logs directory if not exist
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir)
}
// Middleware
app.use(cors());
app.use(express.json());


// HTTP request logging (before routes)
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{req.ip}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return req.url === '/health' || req.url === '/favicon.ico';
  },
  requestWhitelist: ['headers', 'url', 'method', 'ip','httpVersion', 'originalUrl', 'query'],
  responseWhitelist: ['statusCode'],
  skip: function (req, res) {
    // Skip successful requests in production to reduce log volume
    return process.env.NODE_ENV === 'production' && res.statusCode < 400;
  }
}));

// Root Routes
app.get("/", (req, res) => {
	logger.info("OdishaVox API accessed")
  res.send("Hello, this is the API for OdishaVox!");
});

// API Routes
app.use('/api/v1/tts', textToSpeechRouter);
app.use('/api/v1/stt', speechToTextRouter);
app.use('/api/v1/sts', speechToSpeechRouter);
app.use('/api/v1/ttt', textToTextRouter);
app.use('/api/v1/feedback', feedbackRouter);


// Error logging middleware (after routes)
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  msg: 'HTTP {{req.method}} {{req.url}} - {{err.message}}'
}));

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params
  });
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start server
// app.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
// });

// Connect DB
const conn = connectDB();

app.listen(PORT, () => {
  logger.info(`Server started successfully on http://localhost:${PORT}`, { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
