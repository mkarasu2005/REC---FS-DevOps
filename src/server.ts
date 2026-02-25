import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();