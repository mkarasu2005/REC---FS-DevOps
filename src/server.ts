import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import User from "./models/user.model"

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const testUser = async () => {
  const user = await User.create({
    email: "test@example.com",
    password: "123456"
  });

  console.log("User created:", user);
};

testUser();