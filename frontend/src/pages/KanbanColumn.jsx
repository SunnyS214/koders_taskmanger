import React from "react";

const KanbanColumn = ({ title, tasks, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-72 min-h-[400px]">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-3 mb-3 rounded shadow hover:shadow-md cursor-pointer"
        >
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500">Priority: {task.priority}</p>
          <div className="flex justify-end mt-2 gap-2">
            <button
              className="text-yellow-500 font-medium"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button
              className="text-red-500 font-medium"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanColumn;
