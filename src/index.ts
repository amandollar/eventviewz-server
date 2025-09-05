import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import connectDB from "./libs/db";
import indexRouter from "./routes/index.routes";
import helmet from "helmet";


//Express App
const app = express();
const PORT = process.env.PORT || 5000;


//Security Headers
app.set("trust proxy", 1);
app.use(helmet());



//Middlewares
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000','https://eventviewz.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use(express.json());
app.use(cookieParser());



//Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "EventViewz Server is running!",
    version: "1.0.0",
  });
});
app.use("/api/v1", indexRouter);

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', error);
  console.error('Error stack:', error.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request headers:', req.headers);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origins: ${JSON.stringify(['http://localhost:3000', 'http://127.0.0.1:3000','https://eventviewz.com'])}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING'}`);
  console.log(`Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'SET' : 'MISSING'}`);
});


