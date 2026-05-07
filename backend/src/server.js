import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Google DNS By calling dns.setServers(["8.8.8.8", "8.8.4.4"]), you are telling Node.js to use Google Public DNS for all subsequent network-based resolution calls (like dns.resolve()) instead of the default servers provided by your Operating System or ISP.

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js"; // Note: .js extension is REQUIRED in ESM
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser"; // npm install cookie-parser
import { errorHandler } from "./middleware/errorMiddleware.js";
import customerRoutes from "./routes/customerRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


const app=express();

app.use(cors({
  origin: "http://localhost:5173", // Allow your frontend
  credentials: true                // Allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // Add this for JWT cookies
app.use(errorHandler);

// ... existing routes
app.use("/api/tasks", taskRoutes);

// ... other routes
app.use("/api/leads", leadRoutes);

// ... other routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes); // Add this



connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));