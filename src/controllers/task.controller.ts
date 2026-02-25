import { Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.create({
    ...req.body,
    userId: req.userId
  });

  res.status(201).json(task);
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  });

  res.json({ message: "Task deleted" });
};