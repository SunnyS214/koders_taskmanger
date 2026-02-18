const Task = require("../models/task.model");

// CREATE TASK
// CREATE TASK
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, priority, assignedTo } = req.body;

//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       assignedTo: assignedTo || null,
//       createdBy: req.user.id
//     });

//     // 🔥 Emit event to all clients
//     const io = req.app.get("io");
//     io.emit("taskCreated", task);

//     return res.status(201).json({
//       success: true,
//       message: "Task created successfully",
//       data: task
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;

    // 🔥 Fix: Agar user role 'user' hai to assignedTo force karo
    let finalAssignedTo = assignedTo;
    if (req.user.role === 'user') {
      finalAssignedTo = req.user.id; // User apne aap ko assign karega
    }

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo: finalAssignedTo || null,
      createdBy: req.user.id
    });

    const io = req.app.get("io");
    io.emit("taskCreated", task);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};















// get tsk
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, assignedTo } = req.query;

    const query = { isDeleted: false };

    if (req.user.role !== "admin") {
      query.createdBy = req.user.id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo && req.user.role === "admin") query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");

    return res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// UPDATE TASK (with real-time)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);
    await task.save();

    // 🔥 Emit event to all clients
    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    return res.json({
      success: true,
      message: "Task updated",
      data: task
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};












// DELETE TASK (soft delete)
// DELETE TASK (soft delete)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.isDeleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isDeleted = true;
    await task.save();

    // 🔥 Emit event to all clients
    const io = req.app.get("io");
    io.emit("taskDeleted", task._id);

    return res.json({
      success: true,
      message: "Task deleted"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
