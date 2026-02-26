import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import api from "../api/axios";
import { useState } from "react";
import type { Task } from "../types";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // GET TASKS
  const { data: tasks = [], isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  // CREATE TASK
  const createTask = useMutation({
    mutationFn: async () => {
      if (!title.trim()) return;
      await api.post("/tasks", { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDescription("");
    },
  });

  // DELETE TASK
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // TOGGLE COMPLETE
  const toggleComplete = useMutation({
    mutationFn: async (task: Task) => {
      await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <>
      {/* ✅ NAVBAR NOW USED */}
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Task Dashboard
          </h1>

          {/* CREATE FORM */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <input
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
            />

            <textarea
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
            />

            <button
              onClick={() => createTask.mutate()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            >
              Add Task
            </button>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <p className="text-center text-gray-500">Loading tasks...</p>
          )}

          {/* ERROR STATE */}
          {isError && (
            <p className="text-center text-red-500">
              Failed to fetch tasks
            </p>
          )}

          {/* TASK LIST */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      task.completed
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {task.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Created:{" "}
                    {format(new Date(task.createdAt), "PPP p")}
                  </p>
                </div>

                <div className="flex gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => toggleComplete.mutate(task)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white transition"
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    onClick={() =>
                      deleteTask.mutate(task._id)
                    }
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && !isLoading && (
              <p className="text-center text-gray-500">
                No tasks found.
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;