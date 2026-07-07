import pinoHttp from 'pino-http';
import logger from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  // Don't log health check requests to reduce noise
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
  customLogLevel: (_req, res, error) => {
    if (error || (res.statusCode && res.statusCode >= 500)) return 'error';
    if (res.statusCode && res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, _res, error) => {
    return `${req.method} ${req.url} failed: ${error.message}`;
  },
});
