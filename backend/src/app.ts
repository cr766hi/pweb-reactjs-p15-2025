import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import genreRoutes from './routes/genres';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Health Check
app.get('/health-check', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Hello World!',
    date: new Date().toDateString()
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/genre', genreRoutes);
app.use('/transactions', transactionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;