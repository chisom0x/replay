import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import router from './src/routes/index.js';
import globalErrorHandler from './src/utils/global_error_handler.js';

dotenv.config();

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

export const createServer = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(hpp());
  app.use('/api', limiter);

  app.use(globalErrorHandler);

  app.use('/api/v1/replay', router);

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  return app;
};
