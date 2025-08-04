import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { initializeDefaultAdmin } from './controllers/auth.controller.js';


import authRouter from './routes/auth.routes.js';
import institutionRouter from './routes/institution.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/institutions', institutionRouter);
app.use('/api/v1/admin', adminRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Medical CV System API!',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      institutions: '/api/v1/institutions',
      admin: '/api/v1/admin'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Medical CV System API is running on http://localhost:${PORT}`);
  await connectToDatabase();
  await initializeDefaultAdmin();
});

export default app;