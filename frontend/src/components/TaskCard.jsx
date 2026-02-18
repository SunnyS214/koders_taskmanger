import React, { useState } from "react";
import TaskForm from "./TaskForm";
import api from "../api/axios";
import socket from "../api/socket";

const TaskCard = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      socket.emit("deleteTask", task._id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

 
  const handleUpdate = async (updatedData) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

   
      socket.emit("updateTask", res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="border p-3 rounded shadow bg-gray-50">
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
      <p className="mt-1">
        <span className="font-semibold">Priority:</span>{" "}
        <span className={`px-2 py-1 rounded text-white ${
          task.priority === "high" ? "bg-red-500" :
          task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
        }`}>
          {task.priority}
        </span>
      </p>

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-yellow-400 rounded text-white text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 rounded text-white text-sm"
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
