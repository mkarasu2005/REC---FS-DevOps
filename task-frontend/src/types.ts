export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string | null;
  userId: string;
  createdAt: string;
}
