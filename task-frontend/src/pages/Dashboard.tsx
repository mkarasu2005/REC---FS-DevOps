import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState } from "react";
import type { Task } from "../types";
import Navbar from "../components/Navbar";
import "../index.css"

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

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

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const inProgressCount = tasks.filter(t => !t.completed).length;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0B1120] text-white px-6 py-8">

        <div className="max-w-7xl mx-auto">

          {/* STATS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Tasks" value={tasks.length} color="text-cyan-400" />
            <StatCard title="In Progress" value={inProgressCount} color="text-yellow-400" />
            <StatCard title="Completed" value={completedCount} color="text-green-400" />
          </div>

          

          {/* CREATE TASK */}
          <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={() => createTask.mutate()}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium py-3 hover:opacity-90 transition"
              >
                + Create Task
              </button>
            </div>
          </div>

          {/* TASK LIST */}
          {tasks.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-20 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-xl font-semibold mb-2">
                No tasks yet
              </h2>
              <p className="text-gray-400">
                Create your first secure task to get started
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-[#111827] border border-gray-800 rounded-xl p-6"
                >
                  <h3 className={`text-lg font-semibold mb-2 ${task.completed ? "line-through text-gray-400" : ""}`}>
                    {task.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {task.description}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => toggleComplete.mutate(task)}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      onClick={() => deleteTask.mutate(task._id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Dashboard;

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className={`text-3xl font-bold mt-2 ${color}`}>
      {value}
    </h2>
  </div>
);