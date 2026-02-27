import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useState } from "react";
import type { Task } from "../types";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

  const updateTask = useMutation({
    mutationFn: async ({ id, title, description }: { id: string; title: string; description: string }) => {
      await api.put(`/tasks/${id}`, { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeEditModal();
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTaskToDelete(null);
    },
  });

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleEditSave = () => {
    if (!editingTask || !editTitle.trim()) return;
    updateTask.mutate({
      id: editingTask._id,
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
  };

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
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading tasks...</p>
          ) : tasks.length === 0 ? (
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
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={(task) => toggleComplete.mutate(task)}
                  onEdit={openEditModal}
                  onRequestDelete={setTaskToDelete}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-[#111827] p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="space-y-4">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Task Title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="Task Description"
              />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateTask.isPending || !editTitle.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium disabled:opacity-60"
              >
                {updateTask.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-[#111827] p-6">
            <h2 className="text-xl font-semibold mb-2">Delete Task?</h2>
            <p className="text-gray-300 text-sm">
              This will permanently delete <span className="font-semibold text-white">"{taskToDelete.title}"</span>.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTask.mutate(taskToDelete._id)}
                disabled={deleteTask.isPending}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium disabled:opacity-60"
              >
                {deleteTask.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
