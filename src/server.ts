import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import routes from './routes/routes';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(helmet());

app.use(express.json());
app.use(errorHandler);
connectDB();

app.use('/v1', routes);

app.get('/health', (req, res) => {
 res.json({status: "healthy", message: "SwiftDeliver Backend"});
});

app.get('/register', (req, res) => {
    res.json({status: "registerOpen", message: "SwiftDeliver Register API"});
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
}

export default app;

