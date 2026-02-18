const express = require("express");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middlewares/error.middleware");
const app = express();
const cors = require("cors");
app.use(cors())

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.post("/ping", (req, res) => {
  res.json({ ok: true });
});



module.exports = app;
