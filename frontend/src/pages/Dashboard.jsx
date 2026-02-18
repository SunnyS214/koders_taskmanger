import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import socket from "../api/socket";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const navigate = useNavigate();
  const columns = ["todo", "inprogress", "done"];

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();


    socket.on("taskCreated", (newTask) => {
      setTasks((prev) => {
        
        const exists = prev.some(t => t._id === newTask._id);
        if (exists) return prev;
        return [...prev, newTask];
      });
    });
    
    socket.on("taskUpdated", (updatedTask) =>
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
    );
    
    socket.on("taskDeleted", (deletedId) =>
      setTasks((prev) => prev.filter((t) => t._id !== deletedId))
    );

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    socket.disconnect();
    navigate("/login", { replace: true });
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = draggableId;
    const newStatus = destination.droppableId;

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };


  const handleCreateTask = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      

      setShowForm(false);
      
    
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Task
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {columns.map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 bg-white p-4 rounded-xl shadow-lg min-h-[300px]"
                  >
                    <h2 className="font-bold text-xl capitalize mb-4 border-b pb-2">{col}</h2>
                    {tasks
                      .filter((t) => t.status === col)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 hover:shadow-lg transition"
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;