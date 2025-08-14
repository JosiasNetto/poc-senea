import express from 'express';
import cors from 'cors';
import connectDB from "./config/dbConfig.js";
import setupRoutes from './routes/index.js';

// Connect to database
connectDB();

const app = express();

// CORS Middleware - Allow requests from frontend
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Setup routes
setupRoutes(app);

export default app;