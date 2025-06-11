import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const logLevels = {
	error: 0,
	debug: 1,
	warn: 2,
	data: 3,
	info: 4,
	verbose: 5,
	silly: 6
}

// ES6 modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format for files (structured JSON)
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define log format for console (human-readable)

const consoleLoggingFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.printf(
		info =>
		// https://stackoverflow.com/a/69044670/20358783 more detailLocaleString
		`${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'IST',
			timeZoneName:	'shortOffset'
		})} :: [${info.level.toLocaleUpperCase()}]: ${info.message}`
		),
   winston.format.colorize({ all: true })
);

// Create the logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: fileLogFormat, // Default format for file transports
  defaultMeta: { service: 'OdishaVox' },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error',
      format: fileLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log'),
      format: fileLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to console with readable format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleLoggingFormat
  }));
}

export default logger;
