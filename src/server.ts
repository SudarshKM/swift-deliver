import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import routes from './routes/routes';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { redis } from './config/redis';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(helmet());

app.use(express.json());
connectDB();
app.use('/v1', apiLimiter);
app.use('/v1', (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}, routes);

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
    res.json({status: "registerOpen", message: "SwiftDeliver Register API"});
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
}

export default app;

