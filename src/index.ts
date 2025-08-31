import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import connectDB from "./libs/db";
import indexRouter from "./routes/index.routes";
import { generalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();
const PORT = process.env.PORT;

// Add this before using rateLimit middleware
app.set('trust proxy', 1);

// Global rate limiting - applies to all routes
app.use(generalLimiter);

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
}));
// Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "EventViewz Server is running!",
    version: "1.0.0",
  });
});

app.use("/api/v1", indexRouter);

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


