import express from 'express';
import connectDB from "./config/dbConfig.js";
import setupRoutes from './routes/index.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Setup routes
setupRoutes(app);

export default app;