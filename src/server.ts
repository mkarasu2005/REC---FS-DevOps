import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import User from "./models/user.model";
import Task from "./models/task.model";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  console.log("Server connected to DB");

  // 1️Create a test user
  const user = await User.create({
    email: "taskuser@example.com",
    password: "123456"
  });

  console.log("User created:", user._id);

  // Create a task linked to that user
  const task = await Task.create({
    title: "Learn Mongoose Relations",
    description: "Understand ref and ObjectId usage",
    userId: user._id
  });

  console.log("Task created:", task);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();