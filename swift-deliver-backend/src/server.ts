import express from 'express'
import http from 'http';
import cors from 'cors';
import logger from './config/logger';
import { requestLogger } from './middleware/requestLogger';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import routes from './routes/routes';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { redis } from './config/redis';
import { apiLimiter } from './middleware/rateLimiter';
import './workers/orderWorker'
import { Server } from 'socket.io';

declare global {
  var io: Server;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const httpServer = http.createServer(app);

const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173',   // Vite development port
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins
  }
});

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "Client connected");

  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on("disconnect", () => {
    logger.info({ socketId: socket.id }, "Client disconnected");
  })
})

// Make io available to controllers if needed (or use global)
global.io = io;   // Simple way for now

app.use(helmet());

app.use(express.json());

connectDB();

app.use(requestLogger);

app.use('/v1', apiLimiter);
app.use('/v1', routes);

app.get('/health', async (req, res) => {
  let redisStatus = 'disconnected';
  try {
    const pong = await redis.ping();
    if (pong === 'PONG') redisStatus = 'connected';
  } catch {
    redisStatus = 'disconnected';
  }
  res.json({ status: 'healthy', message: 'SwiftDeliver Backend', redis: redisStatus });
});

app.get('/register', (req, res) => {
  res.json({ status: "registerOpen", message: "SwiftDeliver Register API" });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info({ port: PORT }, `Server running on port ${PORT}`);
  });
}

export default app;

