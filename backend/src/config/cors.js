import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Local React (Vite) development
  'http://localhost:3000', // Local React alternative port
  process.env.FRONTEND_URL  // Production frontend URL (Vercel)
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};