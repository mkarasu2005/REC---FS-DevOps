import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
}

const TaskCard = ({ task, onToggle, onEdit, onRequestDelete }: TaskCardProps) => {
  const priority = task.priority ?? "medium";
  const priorityStyles: Record<Task["priority"], string> = {
    high: "bg-red-500/20 text-red-300 border-red-500/40",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    low: "bg-green-500/20 text-green-300 border-green-500/40",
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition">

      <h3
        className={`text-lg font-semibold mb-2 ${
          task.completed ? "line-through text-gray-400" : "text-white"
        }`}
      >
        {task.title}
      </h3>

      <p className="text-gray-400 text-sm">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full border px-2.5 py-1 font-semibold uppercase tracking-wide ${priorityStyles[priority]}`}>
          {priority}
        </span>
        <span className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-gray-300">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </span>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => onToggle(task)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            task.completed
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Edit
        </button>

        <button
          onClick={() => onRequestDelete(task)}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default TaskCard;
