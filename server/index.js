require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

const aiRoutes = require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    data: null,
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});