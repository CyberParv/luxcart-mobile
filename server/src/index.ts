import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';
import { helmetMiddleware } from './middleware/helmet';
import { corsMiddleware } from './middleware/cors';
import { authLimiter, apiLimiter, strictLimiter } from './middleware/rateLimiter';
import { sanitize } from './middleware/sanitize';
import { requestId } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/auth';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(apiLimiter);
app.use(sanitize);
app.use(json());
app.use(requestId);
app.use(morgan('dev'));

app.use('/auth', authRouter);

// Mount entity routers here, e.g., app.use('/workouts', auth, workoutsRouter);

app.use(errorHandler);

app.get('/health', (req, res) => res.json({ success: true, data: 'OK' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));