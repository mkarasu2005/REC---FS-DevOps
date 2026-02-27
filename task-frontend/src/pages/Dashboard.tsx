import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useMemo, useState } from "react";
import type { Task } from "../types";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

type StatusFilter = "all" | "in-progress" | "completed";
type SortOption = "created-desc" | "created-asc" | "priority-desc" | "priority-asc";
type TaskPriority = Task["priority"];

const priorityRank: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const toDateInputValue = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [createError, setCreateError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("created-desc");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  const createTask = useMutation({
    mutationFn: async () => {
      const cleanedTitle = title.trim();
      if (!cleanedTitle) {
        throw new Error("Task title is required");
      }

      await api.post("/tasks", {
        title: cleanedTitle,
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCreateError("");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create task";
      setCreateError(message);
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
    mutationFn: async ({
      id,
      title,
      description,
      priority,
      dueDate,
    }: {
      id: string;
      title: string;
      description: string;
      priority: TaskPriority;
      dueDate?: string | null;
    }) => {
      await api.put(`/tasks/${id}`, { title, description, priority, dueDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeEditModal();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update task";
      setUpdateError(message);
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
    setEditPriority(task.priority ?? "medium");
    setEditDueDate(toDateInputValue(task.dueDate));
    setUpdateError("");
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("medium");
    setEditDueDate("");
    setUpdateError("");
  };

  const handleEditSave = () => {
    if (!editingTask || !editTitle.trim()) return;
    updateTask.mutate({
      id: editingTask._id,
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.filter((t) => !t.completed).length;

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        if (statusFilter === "completed") return task.completed;
        if (statusFilter === "in-progress") return !task.completed;
        return true;
      })
      .filter((task) => {
        if (!normalizedSearch) return true;
        const haystack = `${task.title} ${task.description ?? ""}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const priorityA = priorityRank[a.priority ?? "medium"];
        const priorityB = priorityRank[b.priority ?? "medium"];

        if (sortOption === "priority-desc") return priorityB - priorityA;
        if (sortOption === "priority-asc") return priorityA - priorityB;

        const createdA = new Date(a.createdAt).getTime();
        const createdB = new Date(b.createdAt).getTime();
        if (sortOption === "created-asc") return createdA - createdB;
        return createdB - createdA;
      });
  }, [tasks, statusFilter, searchTerm, sortOption]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0B1120] text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Tasks" value={tasks.length} color="text-cyan-400" />
            <StatCard title="In Progress" value={inProgressCount} color="text-yellow-400" />
            <StatCard title="Completed" value={completedCount} color="text-green-400" />
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Task Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (createError) setCreateError("");
                }}
              />

              <input
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                onClick={() => createTask.mutate()}
                disabled={createTask.isPending}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium py-3 hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {createTask.isPending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {createTask.isPending ? "Creating..." : "+ Create Task"}
                </span>
              </button>
            </div>
            {createError && (
              <p className="mt-3 text-sm text-red-300">{createError}</p>
            )}
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex flex-wrap gap-2">
                {(["all", "in-progress", "completed"] as StatusFilter[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                      statusFilter === value
                        ? "bg-cyan-500 text-white"
                        : "bg-[#1F2937] text-gray-300 hover:bg-[#263244]"
                    }`}
                  >
                    {value === "in-progress" ? "In Progress" : value}
                  </button>
                ))}
              </div>

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description"
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="created-desc">Sort: Newest First</option>
                <option value="created-asc">Sort: Oldest First</option>
                <option value="priority-desc">Sort: Priority High to Low</option>
                <option value="priority-asc">Sort: Priority Low to High</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-400 text-center">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-20 text-center">
              <h2 className="text-xl font-semibold mb-2">
                No tasks yet
              </h2>
              <p className="text-gray-400">
                Create your first secure task to get started
              </p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-20 text-center">
              <h2 className="text-xl font-semibold mb-2">
                No matching tasks
              </h2>
              <p className="text-gray-400">
                Try changing your filters, search term, or sort option
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={(currentTask) => toggleComplete.mutate(currentTask)}
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
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-[#1F2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            {updateError && (
              <p className="mt-3 text-sm text-red-300">{updateError}</p>
            )}
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {updateTask.isPending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {updateTask.isPending ? "Saving..." : "Save Changes"}
                </span>
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  {deleteTask.isPending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {deleteTask.isPending ? "Deleting..." : "Delete"}
                </span>
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
