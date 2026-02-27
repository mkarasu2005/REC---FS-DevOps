import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
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
          onClick={() => onDelete(task._id)}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default TaskCard;