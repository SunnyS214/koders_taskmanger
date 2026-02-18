import React, { useState, useEffect } from "react";

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  });

  useEffect(() => {
    if (task) setFormData(task);
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl w-96 shadow-xl animate-fadeIn"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {task ? "Edit Task" : "Create Task"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {task ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
