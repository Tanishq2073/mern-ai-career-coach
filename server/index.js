require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//middleware
app.use(express.json());
//routes
app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);
connectDB();